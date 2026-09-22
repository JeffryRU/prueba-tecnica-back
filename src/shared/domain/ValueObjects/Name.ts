import { InvalidArgumentError } from '../DomainError.ts'

const MAX_LENGTH = 100

/** Nombre obligatorio (sin espacios sobrantes, máximo 100 caracteres). */
export class Name {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(raw: string): Name {
    const value = raw.trim()
    if (!value) throw new InvalidArgumentError('INVALID_NAME', 'El nombre es obligatorio')
    if (value.length > MAX_LENGTH) {
      throw new InvalidArgumentError(
        'INVALID_NAME',
        `El nombre no puede superar ${MAX_LENGTH} caracteres`,
      )
    }
    return new Name(value)
  }
}
