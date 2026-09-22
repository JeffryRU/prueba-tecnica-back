import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { unique, useTestServer } from '../helpers/testServer.ts'

describe('IdentityAndAccess', () => {
  const api = useTestServer()
  const password = 'Secreta#2026'

  it('HU-01: registra un usuario y devuelve un token', async () => {
    const res = await api.post('/auth/register', {
      name: 'Ana',
      email: `ana.${unique()}@example.com`,
      password,
    })
    assert.equal(res.status, 201)
    assert.ok(res.body.data.token)
    assert.equal(res.body.data.user.passwordHash, undefined)
  })

  it('HU-01: valida la política de contraseñas y el email duplicado', async () => {
    const email = `dup.${unique()}@example.com`
    const weak = await api.post('/auth/register', { name: 'A', email, password: 'debil' })
    assert.equal(weak.status, 400)
    assert.equal(weak.body.error.code, 'WEAK_PASSWORD')

    await api.post('/auth/register', { name: 'A', email, password })
    const duplicated = await api.post('/auth/register', { name: 'B', email, password })
    assert.equal(duplicated.status, 409)
    assert.equal(duplicated.body.error.code, 'EMAIL_ALREADY_EXISTS')
  })

  it('HU-02: inicia sesión y el token da acceso a las rutas protegidas', async () => {
    const email = `login.${unique()}@example.com`
    await api.post('/auth/register', { name: 'Login', email, password })

    const login = await api.post('/auth/login', { email, password })
    assert.equal(login.status, 200)
    assert.equal((await api.get('/customers', { token: login.body.data.token })).status, 200)

    const wrong = await api.post('/auth/login', { email, password: 'Incorrecta#1' })
    assert.equal(wrong.status, 401)
    assert.equal(wrong.body.error.code, 'INVALID_CREDENTIALS')
  })

  it('todas las rutas de negocio exigen token', async () => {
    for (const path of [
      '/customers',
      '/products',
      '/orders',
      '/customers/1/total-spent',
      '/products/1/qr',
    ]) {
      const res = await api.get(path)
      assert.equal(res.status, 401, path)
    }
  })
})
