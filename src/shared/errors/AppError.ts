/**
 * Error controlado de la aplicación. Lleva un código estable para el cliente,
 * un mensaje legible y el estado HTTP con el que debe responderse.
 * Cualquier error que no sea `AppError` se trata como inesperado (500).
 */
export class AppError extends Error {
  readonly code: string
  readonly status: number
  readonly details?: unknown

  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.details = details
  }

  static badRequest(message = 'La solicitud contiene datos inválidos', details?: unknown) {
    return new AppError('BAD_REQUEST', message, 400, details)
  }

  static validation(details: unknown, message = 'Los datos proporcionados son inválidos') {
    return new AppError('VALIDATION_ERROR', message, 400, details)
  }

  static unauthorized(message = 'No autenticado', code = 'UNAUTHORIZED') {
    return new AppError(code, message, 401)
  }

  static forbidden(message = 'No tienes permisos suficientes para realizar esta acción') {
    return new AppError('FORBIDDEN', message, 403)
  }

  static notFound(message = 'El recurso solicitado no fue encontrado', code = 'NOT_FOUND') {
    return new AppError(code, message, 404)
  }

  static conflict(message = 'El recurso ya existe o hay un conflicto', code = 'CONFLICT') {
    return new AppError(code, message, 409)
  }

  static internal() {
    return new AppError('INTERNAL_ERROR', 'Ocurrió un error inesperado, intenta más tarde', 500)
  }
}
