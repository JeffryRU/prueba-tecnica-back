import { InvalidArgumentError } from '../DomainError.ts'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LENGTH = 150

/** Email válido y normalizado (minúsculas, sin espacios). Compartido por User y Customer. */
export class Email {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(raw: string): Email {
    const value = raw.trim().toLowerCase()
    if (!EMAIL_PATTERN.test(value) || value.length > MAX_LENGTH) {
      throw new InvalidArgumentError('INVALID_EMAIL', `El email "${raw}" no es válido`)
    }
    return new Email(value)
  }

  equals(other: Email) {
    return this.value === other.value
  }
}
