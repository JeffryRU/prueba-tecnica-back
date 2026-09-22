import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { registerAndGetToken } from '../helpers/auth.ts'
import { unique, useTestServer } from '../helpers/testServer.ts'

describe('OrderManagement', () => {
  const api = useTestServer()
  let token: string
  let customerId: number
  let laptop: number
  let book: number
  const auth = () => ({ token })

  const createOrder = (items: { productId: number; quantity: number }[], customer = customerId) =>
    api.post('/orders', { customerId: customer, shippingAddress: 'Calle 1', items }, auth())

  before(async () => {
    token = await registerAndGetToken(api)
    customerId = (
      await api.post('/customers', { name: 'Comprador', email: `${unique()}@example.com` }, auth())
    ).body.data.id
    laptop = (
      await api.post('/products', { name: 'Laptop', category: 'Electronics', price: 1000 }, auth())
    ).body.data.id
    book = (await api.post('/products', { name: 'Libro', category: 'Books', price: 12.35 }, auth()))
      .body.data.id
  })

  it('HU-09: crea una orden con productos y cantidades para un cliente', async () => {
    const res = await createOrder([
      { productId: laptop, quantity: 1 },
      { productId: book, quantity: 3 },
    ])
    assert.equal(res.status, 201)
    assert.equal(res.body.data.status, 'pending')
    assert.equal(res.body.data.total, 1037.05)
    assert.equal(res.body.data.items.length, 2)
  })

  it('HU-09: valida cliente, productos y cantidades', async () => {
    const noCustomer = await createOrder([{ productId: book, quantity: 1 }], 999_999)
    assert.equal(noCustomer.body.error.code, 'CUSTOMER_NOT_FOUND')

    const noProduct = await createOrder([{ productId: 999_999, quantity: 1 }])
    assert.equal(noProduct.body.error.code, 'PRODUCT_NOT_FOUND')

    const badQuantity = await createOrder([{ productId: book, quantity: 0 }])
    assert.equal(badQuantity.body.error.code, 'INVALID_QUANTITY')

    const empty = await createOrder([])
    assert.equal(empty.status, 400)
  })

  it('HU-10: muestra el historial del cliente con productos, cantidades y precios', async () => {
    const res = await api.get(`/customers/${customerId}/orders`, auth())
    assert.equal(res.status, 200)
    const [order] = res.body.data
    const bookItem = order.items.find((i: any) => i.productId === book)
    assert.deepEqual(
      {
        name: bookItem.productName,
        unitPrice: bookItem.unitPrice,
        quantity: bookItem.quantity,
        subtotal: bookItem.subtotal,
      },
      { name: 'Libro', unitPrice: 12.35, quantity: 3, subtotal: 37.05 },
    )
  })

  it('HU-11: calcula el total gastado en todas las órdenes', async () => {
    await createOrder([{ productId: book, quantity: 2 }]) // 24.70
    const res = await api.get(`/customers/${customerId}/total-spent`, auth())
    assert.equal(res.status, 200)
    assert.deepEqual(res.body.data, { customerId, ordersCount: 2, totalSpent: 1061.75 })
    assert.equal((await api.get('/customers/999999/total-spent', auth())).status, 404)
  })

  it('actualiza el estado respetando las transiciones y elimina la orden', async () => {
    const { id } = (await createOrder([{ productId: book, quantity: 1 }])).body.data

    const processing = await api.patch(`/orders/${id}`, { status: 'processing' }, auth())
    assert.equal(processing.body.data.status, 'processing')

    const completed = await api.patch(`/orders/${id}`, { status: 'completed' }, auth())
    assert.ok(completed.body.data.shippedAt)

    const invalid = await api.patch(`/orders/${id}`, { status: 'pending' }, auth())
    assert.equal(invalid.status, 409)
    assert.equal(invalid.body.error.code, 'INVALID_STATUS_TRANSITION')

    assert.equal((await api.delete(`/orders/${id}`, auth())).status, 204)
    assert.equal((await api.get(`/orders/${id}`, auth())).status, 404)
  })

  it('elimina en cascada las órdenes al eliminar el cliente', async () => {
    const other = (
      await api.post('/customers', { name: 'Temporal', email: `${unique()}@example.com` }, auth())
    ).body.data.id
    const { id } = (await createOrder([{ productId: book, quantity: 1 }], other)).body.data

    await api.delete(`/customers/${other}`, auth())
    assert.equal((await api.get(`/orders/${id}`, auth())).status, 404)
  })
})
