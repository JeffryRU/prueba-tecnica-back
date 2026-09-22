import type { AuthUser } from '../modules/auth/token.service.ts'

declare global {
  namespace Express {
    interface Request {
      /** Usuario autenticado; lo establece el middleware `authenticate`. */
      user?: AuthUser
    }
  }
}
