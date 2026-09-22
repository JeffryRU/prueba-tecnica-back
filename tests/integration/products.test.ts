import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { registerAndGetToken } from '../helpers/auth.ts'
import { useTestServer } from '../helpers/testServer.ts'

describe('ProductManagement', () => {
  const api = useTestServer()
  let token: string
  const auth = () => ({ token })

  const createProduct = (name: string, category: string, price: number) =>
    api.post('/products', { name, category, price }, auth())

  before(async () => {
    token = await registerAndGetToken(api)
  })

  it('HU-07: crea productos y valida categoría y precio', async () => {
    const res = await createProduct('Kindle', 'Electronics', 129.99)
    assert.equal(res.status, 201)
    assert.equal(res.body.data.category, 'Electronics')

    const category = await createProduct('Pelota', 'Toys', 10)
    assert.equal(category.body.error.code, 'INVALID_CATEGORY')
    const price = await createProduct('Gratis', 'Books', -5)
    assert.equal(price.body.error.code, 'INVALID_PRICE')
  })

  it('HU-08: filtra por categoría y ordena por precio', async () => {
    for (const price of [30, 10, 20]) await createProduct(`Libro ${price}`, 'Books', price)

    const list = async (sort: string) => {
      const res = await api.get(`/products?category=Books&sort=${sort}&pageSize=100`, auth())
      assert.ok(res.body.data.items.every((p: any) => p.category === 'Books'))
      return res.body.data.items.map((p: any) => p.price)
    }
    const asc = await list('asc')
    assert.deepEqual(
      asc,
      [...asc].sort((a, b) => a - b),
    )
    assert.deepEqual(await list('desc'), [...asc].reverse())

    assert.equal((await api.get('/products?category=Toys', auth())).status, 400)
  })

  it('actualiza y elimina un producto', async () => {
    const { id } = (await createProduct('Polo', 'Clothing', 20)).body.data
    const updated = await api.patch(`/products/${id}`, { price: 25.5 }, auth())
    assert.equal(updated.body.data.price, 25.5)
    assert.equal((await api.delete(`/products/${id}`, auth())).status, 204)
    assert.equal((await api.get(`/products/${id}`, auth())).status, 404)
  })

  it('HU-12: genera el QR del producto en PNG y SVG', async () => {
    const { id } = (await createProduct('Monitor', 'Electronics', 199)).body.data
    const png = await fetchRaw(api, `/products/${id}/qr`, token)
    assert.equal(png.status, 200)
    assert.equal(png.type, 'image/png')

    const svg = await fetchRaw(api, `/products/${id}/qr?format=svg`, token)
    assert.match(svg.type!, /image\/svg\+xml/)

    assert.equal((await api.get('/products/999999/qr', auth())).status, 404)
  })
})

/** El cliente de pruebas parsea JSON; para imágenes se revisan estado y content-type. */
async function fetchRaw(api: ReturnType<typeof useTestServer>, path: string, token: string) {
  const res = await api.raw(path, token)
  return { status: res.status, type: res.headers.get('content-type')?.split(';')[0] }
}
