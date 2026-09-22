import type { AuthUser } from '../IdentityAndAccess/User/Domain/Contract/TokenService.ts'

declare global {
  namespace Express {
    interface Request {
      /** Usuario autenticado; lo establece el middleware `authenticate`. */
      user?: AuthUser
    }
  }
}
