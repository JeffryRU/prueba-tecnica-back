import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { unique, useTestServer } from './helpers/testServer.ts'

describe('Libros', () => {
  const api = useTestServer()
  let authorId: number
  let otherAuthorId: number

  const newBook = (overrides = {}) => ({
    title: 'Libro de prueba',
    description: 'Descripción de prueba',
    price: 25.5,
    authorId,
    ...overrides,
  })

  before(async () => {
    authorId = (await api.post('/authors', { name: 'A', email: `a.${unique()}@example.com` })).body
      .data.id
    otherAuthorId = (await api.post('/authors', { name: 'B', email: `b.${unique()}@example.com` }))
      .body.data.id
  })

  it('HU-01: crea un libro asignado a un autor', async () => {
    const res = await api.post('/books', newBook())
    assert.equal(res.status, 201)
    assert.equal(res.body.data.author.id, authorId)
    assert.equal(res.body.data.price, 25.5)
  })

  it('HU-01: rechaza un autor inexistente', async () => {
    const res = await api.post('/books', newBook({ authorId: 999_999 }))
    assert.equal(res.status, 422)
    assert.equal(res.body.error.code, 'AUTHOR_NOT_FOUND')
  })

  it('HU-01: valida los campos obligatorios y el precio', async () => {
    const res = await api.post('/books', { title: '', price: -5, authorId })
    assert.equal(res.status, 400)
    const fields = res.body.error.details.map((d: { field: string }) => d.field)
    assert.deepEqual(fields.sort(), ['description', 'price', 'title'])
  })

  it('HU-02: lista los libros con su autor', async () => {
    const res = await api.get(`/books?authorId=${authorId}`)
    assert.equal(res.status, 200)
    assert.ok(res.body.data.length >= 1)
    assert.ok(res.body.data.every((book: any) => book.author.id === authorId))
  })

  it('HU-03: muestra el detalle de un libro con su autor', async () => {
    const { id } = (await api.post('/books', newBook())).body.data
    const res = await api.get(`/books/${id}`)
    assert.equal(res.status, 200)
    assert.equal(res.body.data.author.id, authorId)
    assert.equal((await api.get('/books/999999')).status, 404)
  })

  it('HU-04: actualiza un libro y su autor', async () => {
    const { id } = (await api.post('/books', newBook())).body.data

    const patched = await api.patch(`/books/${id}`, { price: 99.9, authorId: otherAuthorId })
    assert.equal(patched.status, 200)
    assert.equal(patched.body.data.price, 99.9)
    assert.equal(patched.body.data.author.id, otherAuthorId)

    const replaced = await api.put(`/books/${id}`, newBook({ title: 'Reemplazado' }))
    assert.equal(replaced.status, 200)
    assert.equal(replaced.body.data.title, 'Reemplazado')

    assert.equal((await api.put(`/books/${id}`, { title: 'Incompleto' })).status, 400)
  })

  it('HU-05: elimina un libro', async () => {
    const { id } = (await api.post('/books', newBook())).body.data
    assert.equal((await api.delete(`/books/${id}`)).status, 204)
    assert.equal((await api.get(`/books/${id}`)).status, 404)
  })

  it('elimina en cascada los libros al eliminar su autor', async () => {
    const author = await api.post('/authors', { name: 'C', email: `c.${unique()}@example.com` })
    const book = await api.post('/books', newBook({ authorId: author.body.data.id }))

    assert.equal((await api.delete(`/authors/${author.body.data.id}`)).status, 204)
    assert.equal((await api.get(`/books/${book.body.data.id}`)).status, 404)
  })
})
