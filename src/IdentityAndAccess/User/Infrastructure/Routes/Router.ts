import { Router } from 'express'
import { LoginUseCase } from '../../Application/LoginUseCase.ts'
import { RegisterUseCase } from '../../Application/RegisterUseCase.ts'
import type { PasswordHasher } from '../../Domain/Contract/PasswordHasher.ts'
import type { TokenService } from '../../Domain/Contract/TokenService.ts'
import type { UserContract } from '../../Domain/Contract/UserContract.ts'
import { AuthController } from '../Controllers/AuthController.ts'

type Dependencies = { users: UserContract; hasher: PasswordHasher; tokens: TokenService }

/** Rutas públicas de autenticación: /register y /login. */
export function authRouter({ users, hasher, tokens }: Dependencies) {
  const controller = new AuthController(
    new RegisterUseCase(users, hasher, tokens),
    new LoginUseCase(users, hasher, tokens),
  )
  return Router().post('/register', controller.register).post('/login', controller.login)
}
