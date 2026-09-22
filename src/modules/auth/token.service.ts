import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../../shared/config/env.ts'

export type AuthUser = { id: number; email: string }

export interface TokenService {
  sign(user: AuthUser): string
  /** Devuelve el usuario del token o `null` si es inválido o expiró. */
  verify(token: string): AuthUser | null
}

export const jwtTokenService: TokenService = {
  sign: ({ id, email }) =>
    jwt.sign({ email }, env.JWT_SECRET, {
      subject: String(id),
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    }),

  verify: (token) => {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET)
      if (typeof payload === 'string' || !payload.sub) return null
      return { id: Number(payload.sub), email: String(payload.email) }
    } catch {
      return null
    }
  },
}
