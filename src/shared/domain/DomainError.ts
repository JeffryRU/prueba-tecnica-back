/**
 * Errores de dominio. No conocen HTTP: cada tipo expresa una categoría de fallo de negocio
 * y la infraestructura decide cómo traducirlo (ver `shared/http/errorHandler.ts`).
 */
export abstract class DomainError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = new.target.name
    this.code = code
  }
}

/** Un dato no cumple una regla de negocio (valor inválido). */
export class InvalidArgumentError extends DomainError {}

/** La entidad buscada no existe. */
export class NotFoundError extends DomainError {}

/** La operación choca con el estado actual (duplicados, transiciones no permitidas…). */
export class ConflictError extends DomainError {}

/** Credenciales o identidad no válidas. */
export class UnauthorizedError extends DomainError {}
