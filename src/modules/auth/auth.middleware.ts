import type { Request, RequestHandler } from 'express'
import { AppError } from '../../shared/errors/AppError.ts'
import type { AuthUser, TokenService } from './token.service.ts'

/** Exige un `Authorization: Bearer <token>` válido y deja el usuario en `req.user`. */
export function authenticate(tokens: TokenService): RequestHandler {
  return (req, _res, next) => {
    const [scheme, token] = req.headers.authorization?.split(' ') ?? []
    if (scheme !== 'Bearer' || !token) {
      throw AppError.unauthorized('Debes enviar un token Bearer', 'TOKEN_MISSING')
    }

    const user = tokens.verify(token)
    if (!user) throw AppError.unauthorized('El token es inválido o expiró', 'TOKEN_INVALID')

    req.user = user
    next()
  }
}

/** Usuario autenticado de la petición (solo en rutas protegidas por `authenticate`). */
export function currentUser(req: Request): AuthUser {
  if (!req.user) throw AppError.unauthorized()
  return req.user
}
