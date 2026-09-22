import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { unique, useTestServer } from './helpers/testServer.ts'

describe('Autores', () => {
  const api = useTestServer()

  it('crea, obtiene, actualiza y elimina un autor', async () => {
    const email = `autor.${unique()}@example.com`

    const created = await api.post('/authors', { name: 'Autor de prueba', email })
    assert.equal(created.status, 201)
    assert.equal(created.body.data.email, email)
    const id = created.body.data.id

    const shown = await api.get(`/authors/${id}`)
    assert.equal(shown.status, 200)
    assert.deepEqual(shown.body.data.books, [])

    const updated = await api.patch(`/authors/${id}`, { name: 'Nombre nuevo' })
    assert.equal(updated.status, 200)
    assert.equal(updated.body.data.name, 'Nombre nuevo')

    assert.equal((await api.delete(`/authors/${id}`)).status, 204)
    assert.equal((await api.get(`/authors/${id}`)).status, 404)
  })

  it('rechaza un email inválido', async () => {
    const res = await api.post('/authors', { name: 'X', email: 'no-es-email' })
    assert.equal(res.status, 400)
    assert.equal(res.body.error.code, 'VALIDATION_ERROR')
  })

  it('rechaza un email duplicado (sin distinguir mayúsculas)', async () => {
    const email = `dup.${unique()}@example.com`
    await api.post('/authors', { name: 'Original', email })
    const res = await api.post('/authors', { name: 'Copia', email: email.toUpperCase() })
    assert.equal(res.status, 409)
    assert.equal(res.body.error.code, 'DUPLICATE_ENTRY')
  })
})
