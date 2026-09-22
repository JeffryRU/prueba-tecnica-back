import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { registerAndGetToken } from '../helpers/auth.ts'
import { unique, useTestServer } from '../helpers/testServer.ts'

describe('CustomerManagement', () => {
  const api = useTestServer()
  let token: string
  const tag = `grupo${unique()}`
  const auth = () => ({ token })

  const createCustomer = (name: string) =>
    api.post('/customers', { name, email: `${unique()}@example.com` }, auth())

  before(async () => {
    token = await registerAndGetToken(api)
    for (const name of ['Alfa', 'Beta', 'Gamma']) {
      await createCustomer(`${name} ${tag}`)
      await new Promise((r) => setTimeout(r, 1100)) // created_at distinto (precisión de segundos)
    }
  })

  it('HU-03: crea un cliente', async () => {
    const res = await createCustomer(`Nuevo ${unique()}`)
    assert.equal(res.status, 201)
    assert.ok(res.body.data.id)
  })

  it('HU-03: valida email y nombre', async () => {
    const res = await api.post('/customers', { name: ' ', email: 'x@example.com' }, auth())
    assert.equal(res.status, 400)
    const bad = await api.post('/customers', { name: 'X', email: 'no-es-email' }, auth())
    assert.equal(bad.body.error.code, 'INVALID_EMAIL')
  })

  it('HU-04: filtra por nombre, ordena por fecha y pagina', async () => {
    const names = (sort: string) =>
      api
        .get(`/customers?name=${tag}&sort=${sort}`, auth())
        .then((res) => res.body.data.items.map((c: any) => c.name.split(' ')[0]))

    assert.deepEqual(await names('asc'), ['Alfa', 'Beta', 'Gamma'])
    assert.deepEqual(await names('desc'), ['Gamma', 'Beta', 'Alfa'])

    const page = await api.get(`/customers?name=${tag}&sort=asc&page=2&pageSize=2`, auth())
    assert.equal(page.body.data.total, 3)
    assert.equal(page.body.data.totalPages, 2)
    assert.equal(page.body.data.items.length, 1)
  })

  it('HU-05: actualiza un cliente y evita emails duplicados', async () => {
    const a = (await createCustomer('A')).body.data
    const b = (await createCustomer('B')).body.data

    const updated = await api.patch(`/customers/${a.id}`, { name: 'A editado' }, auth())
    assert.equal(updated.status, 200)
    assert.equal(updated.body.data.name, 'A editado')

    const conflict = await api.put(`/customers/${a.id}`, { name: 'A', email: b.email }, auth())
    assert.equal(conflict.status, 409)
  })

  it('HU-06: elimina un cliente', async () => {
    const { id } = (await createCustomer('Temporal')).body.data
    assert.equal((await api.delete(`/customers/${id}`, auth())).status, 204)
    assert.equal((await api.get(`/customers/${id}`, auth())).status, 404)
  })
})
