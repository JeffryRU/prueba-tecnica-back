import { UnauthorizedError } from '../../../shared/domain/DomainError.ts'
import { Email } from '../../../shared/domain/ValueObjects/Email.ts'
import type { PasswordHasher } from '../Domain/Contract/PasswordHasher.ts'
import type { TokenService } from '../Domain/Contract/TokenService.ts'
import type { UserContract } from '../Domain/Contract/UserContract.ts'
import { createSession, type AuthSession } from './AuthSession.ts'

export type LoginInput = { email: string; password: string }

const invalidCredentials = () =>
  new UnauthorizedError('INVALID_CREDENTIALS', 'Credenciales inválidas')

/** HU-02: inicio de sesión con email y contraseña. */
export class LoginUseCase {
  private readonly users: UserContract
  private readonly hasher: PasswordHasher
  private readonly tokens: TokenService

  constructor(users: UserContract, hasher: PasswordHasher, tokens: TokenService) {
    this.users = users
    this.hasher = hasher
    this.tokens = tokens
  }

  async execute(input: LoginInput): Promise<AuthSession> {
    const user = await this.users.findByEmail(Email.create(input.email))
    // Mismo error si no existe o si la contraseña no coincide: no revela qué emails existen.
    if (!user || !(await this.hasher.compare(input.password, user.passwordHash))) {
      throw invalidCredentials()
    }
    return createSession(user, this.tokens)
  }
}
