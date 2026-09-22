import type { Response } from 'express'
import type { AppError } from '../errors/AppError.ts'

/** Sobre común para todas las respuestas de la API. */
export type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
  error?: { code: string; message: string; details?: unknown }
}

export function ok<T>(res: Response, data: T, message?: string) {
  return res.status(200).json({ success: true, message, data } satisfies ApiResponse<T>)
}

export function created<T>(res: Response, data: T, message?: string) {
  return res.status(201).json({ success: true, message, data } satisfies ApiResponse<T>)
}

export function noContent(res: Response) {
  return res.status(204).end()
}

export function fail(res: Response, error: AppError) {
  return res.status(error.status).json({
    success: false,
    error: { code: error.code, message: error.message, details: error.details },
  } satisfies ApiResponse<never>)
}
