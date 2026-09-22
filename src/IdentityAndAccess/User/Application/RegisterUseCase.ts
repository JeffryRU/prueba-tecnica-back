import { ConflictError } from '../../../shared/domain/DomainError.ts'
import { Email } from '../../../shared/domain/ValueObjects/Email.ts'
import type { PasswordHasher } from '../Domain/Contract/PasswordHasher.ts'
import type { TokenService } from '../Domain/Contract/TokenService.ts'
import type { UserContract } from '../Domain/Contract/UserContract.ts'
import { User } from '../Domain/Entities/User.ts'
import { Password } from '../Domain/ValueObjects/Password.ts'
import { createSession, type AuthSession } from './AuthSession.ts'

export type RegisterInput = { name: string; email: string; password: string }

/** HU-01: registro con nombre, email y contraseña. */
export class RegisterUseCase {
  private readonly users: UserContract
  private readonly hasher: PasswordHasher
  private readonly tokens: TokenService

  constructor(users: UserContract, hasher: PasswordHasher, tokens: TokenService) {
    this.users = users
    this.hasher = hasher
    this.tokens = tokens
  }

  async execute(input: RegisterInput): Promise<AuthSession> {
    const password = Password.create(input.password)
    const email = Email.create(input.email)

    if (await this.users.findByEmail(email)) {
      throw new ConflictError('EMAIL_ALREADY_EXISTS', 'El email ya está registrado')
    }

    const user = User.register({
      name: input.name,
      email: email.value,
      passwordHash: await this.hasher.hash(password.value),
    })
    return createSession(await this.users.save(user), this.tokens)
  }
}
