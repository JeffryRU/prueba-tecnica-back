import { AppError } from '../../shared/errors/AppError.ts'
import { toUserResponse } from '../users/user.mapper.ts'
import { UserModel } from '../users/user.model.ts'
import type { LoginInput, RegisterInput } from './auth.schemas.ts'
import type { PasswordHasher } from './password.hasher.ts'
import type { TokenService } from './token.service.ts'

export class AuthService {
  private readonly hasher: PasswordHasher
  private readonly tokens: TokenService

  constructor(hasher: PasswordHasher, tokens: TokenService) {
    this.hasher = hasher
    this.tokens = tokens
  }

  /** HU-01: registra al usuario (el modelo valida la política y guarda el hash). */
  async register(input: RegisterInput) {
    if (await UserModel.count({ where: { email: input.email } })) {
      throw AppError.conflict('El email ya está registrado', 'EMAIL_ALREADY_EXISTS')
    }
    const user = await UserModel.create(input)
    return this.session(user)
  }

  /** HU-02: autentica con email y contraseña. */
  async login({ email, password }: LoginInput) {
    const user = await UserModel.scope('withPassword').findOne({ where: { email } })
    if (!user || !(await this.hasher.compare(password, user.password))) {
      throw AppError.unauthorized('Credenciales inválidas', 'INVALID_CREDENTIALS')
    }
    return this.session(user)
  }

  async profile(userId: number) {
    const user = await UserModel.findByPk(userId)
    if (!user) throw AppError.notFound('El usuario no existe', 'USER_NOT_FOUND')
    return toUserResponse(user)
  }

  private session(user: UserModel) {
    return {
      token: this.tokens.sign({ id: user.id, email: user.email }),
      user: toUserResponse(user),
    }
  }
}
