import type { ErrorRequestHandler, RequestHandler } from 'express'
import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
} from 'sequelize'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError.ts'
import { fail } from './response.ts'

export const notFoundHandler: RequestHandler = (req) => {
  throw AppError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND')
}

/** Traduce cualquier error lanzado en la app a una respuesta HTTP con el sobre común. */
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  fail(res, toAppError(error))
}

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error

  if (error instanceof ZodError) {
    return AppError.validation(
      error.issues.map(({ path, message }) => ({ field: path.join('.'), message })),
    )
  }

  // Debe ir antes que SequelizeValidationError porque hereda de ella
  if (error instanceof UniqueConstraintError) {
    return new AppError(
      'DUPLICATE_ENTRY',
      'Ya existe un registro con esos datos',
      409,
      error.errors.map(({ path, message }) => ({ field: path, message })),
    )
  }

  if (error instanceof SequelizeValidationError) {
    return AppError.validation(error.errors.map(({ path, message }) => ({ field: path, message })))
  }

  if (error instanceof ForeignKeyConstraintError) {
    return new AppError('INVALID_REFERENCE', 'La referencia a otro registro no es válida', 409)
  }

  // JSON mal formado en el body (lanzado por express.json)
  if (error instanceof SyntaxError && 'body' in error) {
    return AppError.badRequest('El cuerpo de la petición no es un JSON válido')
  }

  console.error(error)
  return AppError.internal()
}
