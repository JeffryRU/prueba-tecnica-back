import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { unique, useTestServer } from './helpers/testServer.ts'

describe('Posts', () => {
  const api = useTestServer()
  const session = { token: '', userId: 0 }
  const other = { token: '', userId: 0 }

  async function register(name: string) {
    const res = await api.post('/auth/register', {
      name,
      email: `${name.toLowerCase()}.${unique()}@example.com`,
      password: 'Secreta#2026',
    })
    return { token: res.body.data.token as string, userId: res.body.data.user.id as number }
  }

  const createPost = (token: string, title = 'Post de prueba') =>
    api.post('/posts', { title, content: 'Contenido' }, { token })

  before(async () => {
    Object.assign(session, await register('Yo'))
    Object.assign(other, await register('Otro'))
    for (let i = 1; i <= 3; i++) await createPost(session.token, `Mío ${i}`)
    await createPost(other.token, 'Del otro')
  })

  it('HU-03: crea un post asociado al usuario autenticado', async () => {
    const res = await createPost(session.token)
    assert.equal(res.status, 201)
    assert.equal(res.body.data.userId, session.userId)
    assert.equal(res.body.data.author.name, 'Yo')
  })

  it('HU-03: valida los campos obligatorios', async () => {
    const res = await api.post('/posts', { title: '' }, { token: session.token })
    assert.equal(res.status, 400)
  })

  it('HU-04: lista con paginación', async () => {
    const res = await api.get('/posts?page=1&pageSize=2', { token: session.token })
    assert.equal(res.status, 200)
    const { items, total, page, pageSize, totalPages } = res.body.data
    assert.equal(items.length, 2)
    assert.equal(page, 1)
    assert.equal(pageSize, 2)
    assert.equal(totalPages, Math.ceil(total / 2))
  })

  it('HU-05: filtra por el usuario que creó el post', async () => {
    const res = await api.get(`/posts?userId=${other.userId}`, { token: session.token })
    assert.equal(res.body.data.total, 1)
    assert.equal(res.body.data.items[0].userId, other.userId)
  })

  it('HU-06: filtra por los posts creados por mí', async () => {
    const res = await api.get('/posts?mine=true&pageSize=100', { token: session.token })
    assert.ok(res.body.data.total >= 3)
    assert.ok(res.body.data.items.every((post: any) => post.userId === session.userId))
  })

  it('HU-07: ordena por fecha de creación', async () => {
    const byDate = (sort: string) =>
      api
        .get(`/posts?mine=true&sort=${sort}&pageSize=100`, { token: session.token })
        .then((res) => res.body.data.items.map((post: any) => post.id))

    const desc = await byDate('desc')
    const asc = await byDate('asc')
    assert.deepEqual(asc, [...desc].reverse())
    assert.equal((await api.get('/posts?sort=otro', { token: session.token })).status, 400)
  })

  it('HU-08: el autor actualiza y elimina su post', async () => {
    const { id } = (await createPost(session.token)).body.data

    const patched = await api.patch(`/posts/${id}`, { title: 'Editado' }, { token: session.token })
    assert.equal(patched.status, 200)
    assert.equal(patched.body.data.title, 'Editado')

    const replaced = await api.put(
      `/posts/${id}`,
      { title: 'Reemplazado', content: 'Nuevo contenido' },
      { token: session.token },
    )
    assert.equal(replaced.body.data.content, 'Nuevo contenido')

    assert.equal((await api.delete(`/posts/${id}`, { token: session.token })).status, 204)
    assert.equal((await api.get(`/posts/${id}`, { token: session.token })).status, 404)
  })

  it('HU-08: otro usuario no puede modificar ni eliminar el post', async () => {
    const { id } = (await createPost(session.token)).body.data
    const patch = await api.patch(`/posts/${id}`, { title: 'Hackeado' }, { token: other.token })
    assert.equal(patch.status, 403)
    assert.equal((await api.delete(`/posts/${id}`, { token: other.token })).status, 403)
  })
})
