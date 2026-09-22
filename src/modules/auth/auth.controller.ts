import type { Request, Response } from 'express'
import { created, ok } from '../../shared/http/response.ts'
import { currentUser } from './auth.middleware.ts'
import { loginSchema, registerSchema } from './auth.schemas.ts'
import type { AuthService } from './auth.service.ts'

export class AuthController {
  private readonly service: AuthService

  constructor(service: AuthService) {
    this.service = service
  }

  register = async (req: Request, res: Response) => {
    const input = registerSchema.parse(req.body)
    created(res, await this.service.register(input), 'Usuario registrado')
  }

  login = async (req: Request, res: Response) => {
    const input = loginSchema.parse(req.body)
    ok(res, await this.service.login(input), 'Sesión iniciada')
  }

  me = async (req: Request, res: Response) => {
    ok(res, await this.service.profile(currentUser(req).id))
  }
}
