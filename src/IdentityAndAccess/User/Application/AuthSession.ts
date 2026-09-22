import type { TokenService } from '../Domain/Contract/TokenService.ts'
import type { User } from '../Domain/Entities/User.ts'

export type AuthSession = { token: string; user: ReturnType<User['toPublic']> }

/** Construye la sesión (token + datos públicos) de un usuario persistido. */
export function createSession(user: User, tokens: TokenService): AuthSession {
  const publicUser = user.toPublic()
  return { token: tokens.sign({ id: publicUser.id, email: publicUser.email }), user: publicUser }
}
