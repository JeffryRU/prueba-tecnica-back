import { Email } from '../../../../shared/domain/ValueObjects/Email.ts'
import { Name } from '../../../../shared/domain/ValueObjects/Name.ts'

export type UserPrimitives = {
  id: number | null
  name: string
  email: string
  passwordHash: string
  createdAt: Date | null
}

export class User {
  readonly id: number | null
  readonly name: Name
  readonly email: Email
  readonly passwordHash: string
  readonly createdAt: Date | null

  private constructor(
    id: number | null,
    name: Name,
    email: Email,
    passwordHash: string,
    createdAt: Date | null,
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.passwordHash = passwordHash
    this.createdAt = createdAt
  }

  /** Nuevo usuario (aún sin persistir). La contraseña ya debe venir hasheada. */
  static register(props: { name: string; email: string; passwordHash: string }): User {
    return new User(
      null,
      Name.create(props.name),
      Email.create(props.email),
      props.passwordHash,
      null,
    )
  }

  /** Reconstruye un usuario existente desde la persistencia. */
  static fromPrimitives(p: UserPrimitives): User {
    return new User(p.id, Name.create(p.name), Email.create(p.email), p.passwordHash, p.createdAt)
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id,
      name: this.name.value,
      email: this.email.value,
      passwordHash: this.passwordHash,
      createdAt: this.createdAt,
    }
  }

  /** Datos públicos: nunca incluye el hash de la contraseña. */
  toPublic() {
    return {
      id: this.id!,
      name: this.name.value,
      email: this.email.value,
      createdAt: this.createdAt,
    }
  }
}
