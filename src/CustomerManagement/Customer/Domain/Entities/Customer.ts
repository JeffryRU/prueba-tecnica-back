import { Email } from '../../../../shared/domain/ValueObjects/Email.ts'
import { Name } from '../../../../shared/domain/ValueObjects/Name.ts'

export type CustomerPrimitives = {
  id: number | null
  name: string
  email: string
  createdAt: Date | null
  updatedAt: Date | null
}

export class Customer {
  readonly id: number | null
  readonly name: Name
  readonly email: Email
  readonly createdAt: Date | null
  readonly updatedAt: Date | null

  private constructor(p: {
    id: number | null
    name: Name
    email: Email
    createdAt: Date | null
    updatedAt: Date | null
  }) {
    this.id = p.id
    this.name = p.name
    this.email = p.email
    this.createdAt = p.createdAt
    this.updatedAt = p.updatedAt
  }

  static create(props: { name: string; email: string }): Customer {
    return new Customer({
      id: null,
      name: Name.create(props.name),
      email: Email.create(props.email),
      createdAt: null,
      updatedAt: null,
    })
  }

  static fromPrimitives(p: CustomerPrimitives): Customer {
    return new Customer({ ...p, name: Name.create(p.name), email: Email.create(p.email) })
  }

  /** Devuelve una copia con los cambios aplicados (la entidad es inmutable). */
  update(changes: { name?: string; email?: string }): Customer {
    return new Customer({
      ...this,
      name: changes.name === undefined ? this.name : Name.create(changes.name),
      email: changes.email === undefined ? this.email : Email.create(changes.email),
    })
  }

  toPrimitives(): CustomerPrimitives {
    return {
      id: this.id,
      name: this.name.value,
      email: this.email.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
