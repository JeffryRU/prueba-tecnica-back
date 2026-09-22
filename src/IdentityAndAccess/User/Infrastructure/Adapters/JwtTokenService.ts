import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../../../../shared/config/env.ts'
import type { AuthUser, TokenService } from '../../Domain/Contract/TokenService.ts'

export class JwtTokenService implements TokenService {
  sign({ id, email }: AuthUser) {
    return jwt.sign({ email }, env.JWT_SECRET, {
      subject: String(id),
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    })
  }

  verify(token: string): AuthUser | null {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET)
      if (typeof payload === 'string' || !payload.sub) return null
      return { id: Number(payload.sub), email: String(payload.email) }
    } catch {
      return null
    }
  }
}
