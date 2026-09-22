import { Router } from 'express'
import { crudRouter } from './shared/http/crudRouter.ts'
import { AuthController } from './modules/auth/auth.controller.ts'
import { authenticate } from './modules/auth/auth.middleware.ts'
import { AuthService } from './modules/auth/auth.service.ts'
import { bcryptPasswordHasher } from './modules/auth/password.hasher.ts'
import { jwtTokenService } from './modules/auth/token.service.ts'
import { PostController } from './modules/posts/post.controller.ts'
import { PostService } from './modules/posts/post.service.ts'
import { listUsers } from './modules/users/user.controller.ts'

/** Raíz de composición: crea las dependencias y monta los routers de cada módulo. */
export function apiRouter() {
  const auth = new AuthController(new AuthService(bcryptPasswordHasher, jwtTokenService))
  const requireAuth = authenticate(jwtTokenService)

  const authRouter = Router()
    .post('/register', auth.register)
    .post('/login', auth.login)
    .get('/me', requireAuth, auth.me)

  return Router()
    .use('/auth', authRouter)
    .get('/users', requireAuth, listUsers)
    .use('/posts', requireAuth, crudRouter(new PostController(new PostService())))
}
