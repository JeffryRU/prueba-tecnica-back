import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { unique, useTestServer } from './helpers/testServer.ts'

const PASSWORD = 'Secreta#2026'

describe('Autenticación', () => {
  const api = useTestServer()

  it('HU-01: registra un usuario y devuelve un token', async () => {
    const email = `nuevo.${unique()}@example.com`
    const res = await api.post('/auth/register', { name: 'Nuevo', email, password: PASSWORD })

    assert.equal(res.status, 201)
    assert.equal(res.body.data.user.email, email)
    assert.ok(res.body.data.token)
    assert.equal(res.body.data.user.password, undefined, 'nunca se expone la contraseña')
  })

  it('HU-01: aplica la política de contraseñas', async () => {
    const weak = ['corta1!', 'sinmayuscula1!', 'SinNumero!!', 'SinEspecial123']
    for (const password of weak) {
      const res = await api.post('/auth/register', {
        name: 'X',
        email: `weak.${unique()}@example.com`,
        password,
      })
      assert.equal(res.status, 400, `debería rechazar "${password}"`)
      assert.equal(res.body.error.details[0].field, 'password')
    }
  })

  it('HU-01: rechaza un email ya registrado', async () => {
    const email = `dup.${unique()}@example.com`
    await api.post('/auth/register', { name: 'A', email, password: PASSWORD })
    const res = await api.post('/auth/register', { name: 'B', email, password: PASSWORD })
    assert.equal(res.status, 409)
    assert.equal(res.body.error.code, 'EMAIL_ALREADY_EXISTS')
  })

  it('HU-02: inicia sesión con credenciales válidas', async () => {
    const email = `login.${unique()}@example.com`
    await api.post('/auth/register', { name: 'Login', email, password: PASSWORD })

    const res = await api.post('/auth/login', { email, password: PASSWORD })
    assert.equal(res.status, 200)

    const me = await api.get('/auth/me', { token: res.body.data.token })
    assert.equal(me.status, 200)
    assert.equal(me.body.data.email, email)
  })

  it('HU-02: rechaza credenciales inválidas', async () => {
    const res = await api.post('/auth/login', { email: 'nadie@example.com', password: PASSWORD })
    assert.equal(res.status, 401)
    assert.equal(res.body.error.code, 'INVALID_CREDENTIALS')
  })

  it('protege las rutas sin token o con token inválido', async () => {
    assert.equal((await api.get('/posts')).body.error.code, 'TOKEN_MISSING')
    const invalid = await api.get('/posts', { token: 'no.es.valido' })
    assert.equal(invalid.status, 401)
    assert.equal(invalid.body.error.code, 'TOKEN_INVALID')
  })
})
