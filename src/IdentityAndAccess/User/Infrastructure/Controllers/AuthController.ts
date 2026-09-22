import type { Request, Response } from 'express'
import { created, ok } from '../../../../shared/http/response.ts'
import type { LoginUseCase } from '../../Application/LoginUseCase.ts'
import type { RegisterUseCase } from '../../Application/RegisterUseCase.ts'
import { loginValidator, registerValidator } from '../Validators/AuthValidators.ts'

export class AuthController {
  private readonly registerUseCase: RegisterUseCase
  private readonly loginUseCase: LoginUseCase

  constructor(registerUseCase: RegisterUseCase, loginUseCase: LoginUseCase) {
    this.registerUseCase = registerUseCase
    this.loginUseCase = loginUseCase
  }

  register = async (req: Request, res: Response) => {
    const input = registerValidator.parse(req.body)
    created(res, await this.registerUseCase.execute(input), 'Usuario registrado')
  }

  login = async (req: Request, res: Response) => {
    const input = loginValidator.parse(req.body)
    ok(res, await this.loginUseCase.execute(input), 'Sesión iniciada')
  }
}
