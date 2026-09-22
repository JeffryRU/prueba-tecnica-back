import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { LoginUseCase } from '../../src/IdentityAndAccess/User/Application/LoginUseCase.ts'
import { RegisterUseCase } from '../../src/IdentityAndAccess/User/Application/RegisterUseCase.ts'
import type { PasswordHasher } from '../../src/IdentityAndAccess/User/Domain/Contract/PasswordHasher.ts'
import type { TokenService } from '../../src/IdentityAndAccess/User/Domain/Contract/TokenService.ts'
import type { UserContract } from '../../src/IdentityAndAccess/User/Domain/Contract/UserContract.ts'
import { User } from '../../src/IdentityAndAccess/User/Domain/Entities/User.ts'
import {
  ConflictError,
  InvalidArgumentError,
  UnauthorizedError,
} from '../../src/shared/domain/DomainError.ts'

function inMemoryUsers(): UserContract {
  const users: User[] = []
  return {
    save: async (user) => {
      const stored = User.fromPrimitives({
        ...user.toPrimitives(),
        id: users.length + 1,
        createdAt: new Date(),
      })
      users.push(stored)
      return stored
    },
    findByEmail: async (email) => users.find((u) => u.email.equals(email)) ?? null,
  }
}

const fakeHasher: PasswordHasher = {
  hash: async (plain) => `hashed:${plain}`,
  compare: async (plain, hash) => hash === `hashed:${plain}`,
}

const fakeTokens: TokenService = {
  sign: ({ id }) => `token-${id}`,
  verify: () => null,
}

describe('Registro e inicio de sesión (HU-01, HU-02)', () => {
  const setup = () => {
    const users = inMemoryUsers()
    return {
      register: new RegisterUseCase(users, fakeHasher, fakeTokens),
      login: new LoginUseCase(users, fakeHasher, fakeTokens),
    }
  }
  const valid = { name: 'Ana', email: 'Ana@Example.com', password: 'Segura#123' }

  it('registra con el email normalizado, la contraseña hasheada y devuelve un token', async () => {
    const { register } = setup()
    const session = await register.execute(valid)
    assert.equal(session.token, 'token-1')
    assert.equal(session.user.email, 'ana@example.com')
    assert.equal('passwordHash' in session.user, false)
  })

  it('aplica la política de contraseñas y el formato de email', async () => {
    const { register } = setup()
    for (const password of ['Corta#1', 'sinmayus#123', 'SinNumero#', 'SinEspecial123']) {
      await assert.rejects(register.execute({ ...valid, password }), InvalidArgumentError)
    }
    await assert.rejects(register.execute({ ...valid, email: 'no-es-email' }), InvalidArgumentError)
  })

  it('rechaza emails duplicados', async () => {
    const { register } = setup()
    await register.execute(valid)
    await assert.rejects(register.execute({ ...valid, email: 'ana@example.com' }), ConflictError)
  })

  it('inicia sesión solo con credenciales correctas', async () => {
    const { register, login } = setup()
    await register.execute(valid)

    const session = await login.execute({ email: 'ana@example.com', password: valid.password })
    assert.equal(session.user.name, 'Ana')
    await assert.rejects(
      login.execute({ email: 'ana@example.com', password: 'Otra#1234' }),
      UnauthorizedError,
    )
    await assert.rejects(
      login.execute({ email: 'nadie@example.com', password: valid.password }),
      UnauthorizedError,
    )
  })
})
