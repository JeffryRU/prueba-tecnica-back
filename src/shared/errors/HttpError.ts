/**
 * Error controlado de la aplicación: se responde con su `status` y mensaje.
 * Cualquier otro error se considera inesperado y se responde con 500.
 */
export class HttpError extends Error {
  readonly status: number
  readonly details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.details = details
  }

  static badRequest(message = 'Petición inválida', details?: unknown) {
    return new HttpError(400, message, details)
  }

  static unauthorized(message = 'No autenticado') {
    return new HttpError(401, message)
  }

  static forbidden(message = 'No tienes permiso para realizar esta acción') {
    return new HttpError(403, message)
  }

  static notFound(message = 'Recurso no encontrado') {
    return new HttpError(404, message)
  }

  static conflict(message = 'Conflicto con el estado actual del recurso', details?: unknown) {
    return new HttpError(409, message, details)
  }
}
