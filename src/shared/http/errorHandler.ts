import type { ErrorRequestHandler, RequestHandler } from 'express'
import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
} from 'sequelize'
import { ZodError } from 'zod'
import { HttpError } from '../errors/HttpError.ts'

export const notFoundHandler: RequestHandler = (req) => {
  throw HttpError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`)
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message, details: error.details })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Datos de entrada inválidos',
      details: error.issues.map(({ path, message }) => ({ field: path.join('.'), message })),
    })
    return
  }

  // Debe ir antes que SequelizeValidationError porque hereda de ella
  if (error instanceof UniqueConstraintError) {
    res.status(409).json({
      message: 'Ya existe un registro con esos datos',
      details: error.errors.map(({ path, message }) => ({ field: path, message })),
    })
    return
  }

  if (error instanceof SequelizeValidationError) {
    res.status(400).json({
      message: 'Datos inválidos',
      details: error.errors.map(({ path, message }) => ({ field: path, message })),
    })
    return
  }

  if (error instanceof ForeignKeyConstraintError) {
    res.status(409).json({ message: 'La referencia a otro registro no es válida' })
    return
  }

  // JSON mal formado en el body
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido' })
    return
  }

  console.error(error)
  res.status(500).json({ message: 'Error interno del servidor' })
}
