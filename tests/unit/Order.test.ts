import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Order } from '../../src/OrderManagement/Order/Domain/Entities/Order.ts'
import { ConflictError, InvalidArgumentError } from '../../src/shared/domain/DomainError.ts'

const item = (productId: number, unitPrice: number, quantity: number) => ({
  productId,
  productName: `Producto ${productId}`,
  unitPrice,
  quantity,
})

describe('Order (entidad)', () => {
  it('calcula el total como Σ precio unitario × cantidad', () => {
    const order = Order.create({ customerId: 1, items: [item(1, 10.1, 3), item(2, 0.2, 1)] })
    assert.equal(order.total(), 30.5)
  })

  it('nace en estado pending y agrupa productos repetidos', () => {
    const order = Order.create({ customerId: 1, items: [item(1, 5, 1), item(1, 5, 2)] })
    assert.equal(order.status.value, 'pending')
    assert.equal(order.items.length, 1)
    assert.equal(order.items[0]!.quantity.value, 3)
  })

  it('rechaza órdenes vacías y cantidades inválidas', () => {
    assert.throws(() => Order.create({ customerId: 1, items: [] }), InvalidArgumentError)
    assert.throws(
      () => Order.create({ customerId: 1, items: [item(1, 5, 0)] }),
      InvalidArgumentError,
    )
    assert.throws(
      () => Order.create({ customerId: 1, items: [item(1, 5, 1.5)] }),
      InvalidArgumentError,
    )
  })

  it('respeta las transiciones de estado y registra la fecha de envío al completar', () => {
    const pending = Order.create({ customerId: 1, items: [item(1, 5, 1)] })
    const completed = pending.changeStatus('processing').changeStatus('completed')

    assert.equal(completed.status.value, 'completed')
    assert.ok(completed.shippedAt instanceof Date)
    assert.throws(() => pending.changeStatus('completed'), ConflictError)
    assert.throws(() => completed.changeStatus('pending'), ConflictError)
    assert.throws(() => pending.changeStatus('shipped'), InvalidArgumentError)
  })

  it('no permite cambiar la dirección de una orden cerrada', () => {
    const declined = Order.create({ customerId: 1, items: [item(1, 5, 1)] }).changeStatus(
      'declined',
    )
    assert.throws(() => declined.changeShippingAddress('Otra calle'), ConflictError)
  })
})
