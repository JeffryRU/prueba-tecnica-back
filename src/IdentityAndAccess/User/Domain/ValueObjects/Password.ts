import { InvalidArgumentError } from '../../../../shared/domain/DomainError.ts'

/** Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial. */
const POLICY = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/

/** Contraseña en texto plano que cumple la política de seguridad (nunca se persiste). */
export class Password {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(plain: string): Password {
    if (!POLICY.test(plain)) {
      throw new InvalidArgumentError(
        'WEAK_PASSWORD',
        'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial',
      )
    }
    return new Password(plain)
  }
}
