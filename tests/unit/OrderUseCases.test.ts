import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { CalculateTotalSpentByCustomer } from '../../src/OrderManagement/Order/Application/CalculateTotalSpentByCustomer.ts'
import { CreateOrder } from '../../src/OrderManagement/Order/Application/CreateOrder.ts'
import type { CustomerDirectory } from '../../src/OrderManagement/Order/Domain/Contract/CustomerDirectory.ts'
import type { OrderContract } from '../../src/OrderManagement/Order/Domain/Contract/OrderContract.ts'
import type { ProductCatalog } from '../../src/OrderManagement/Order/Domain/Contract/ProductCatalog.ts'
import { Order } from '../../src/OrderManagement/Order/Domain/Entities/Order.ts'
import { NotFoundError } from '../../src/shared/domain/DomainError.ts'

/** Repositorio en memoria: solo lo que usan estos casos de uso. */
function inMemoryOrders(initial: Order[] = []) {
  const saved: Order[] = [...initial]
  const repo: Pick<OrderContract, 'save' | 'findByCustomer'> = {
    save: async (order) => {
      const stored = Order.fromPrimitives({ ...order.toPrimitives(), id: saved.length + 1 })
      saved.push(stored)
      return stored
    },
    findByCustomer: async (customerId) => saved.filter((o) => o.customerId === customerId),
  }
  return { repo: repo as OrderContract, saved }
}

const customers = (...ids: number[]): CustomerDirectory => ({
  exists: async (id) => ids.includes(id),
})

const catalog: ProductCatalog = {
  findByIds: async (ids) =>
    [
      { id: 1, name: 'Laptop', price: 1000 },
      { id: 2, name: 'Libro', price: 25.5 },
    ].filter((p) => ids.includes(p.id)),
}

const order = (customerId: number, items: [number, number][]) =>
  Order.create({
    customerId,
    items: items.map(([unitPrice, quantity], i) => ({
      productId: i + 1,
      productName: 'P',
      unitPrice,
      quantity,
    })),
  })

describe('CreateOrder (HU-09)', () => {
  it('crea la orden con el precio actual de cada producto', async () => {
    const { repo } = inMemoryOrders()
    const result = await new CreateOrder(repo, customers(7), catalog).execute({
      customerId: 7,
      items: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
      ],
    })
    assert.equal(result.status, 'pending')
    assert.equal(result.total, 1051)
    assert.deepEqual(
      result.items.map((i) => [i.productName, i.unitPrice, i.quantity, i.subtotal]),
      [
        ['Laptop', 1000, 1, 1000],
        ['Libro', 25.5, 2, 51],
      ],
    )
  })

  it('falla si el cliente o algún producto no existen', async () => {
    const { repo } = inMemoryOrders()
    const useCase = new CreateOrder(repo, customers(7), catalog)

    await assert.rejects(
      useCase.execute({ customerId: 99, items: [{ productId: 1, quantity: 1 }] }),
      (e: NotFoundError) => e.code === 'CUSTOMER_NOT_FOUND',
    )
    await assert.rejects(
      useCase.execute({ customerId: 7, items: [{ productId: 3, quantity: 1 }] }),
      (e: NotFoundError) => e.code === 'PRODUCT_NOT_FOUND',
    )
  })
})

describe('CalculateTotalSpentByCustomer (HU-11)', () => {
  it('suma precio unitario × cantidad de todas las órdenes del cliente', async () => {
    const { repo } = inMemoryOrders([
      order(1, [
        [10, 2],
        [5.25, 4],
      ]), // 41
      order(1, [[0.1, 3]]), // 0.3
      order(2, [[999, 1]]), // otro cliente
    ])
    const result = await new CalculateTotalSpentByCustomer(repo, customers(1, 2)).execute(1)
    assert.deepEqual(result, { customerId: 1, ordersCount: 2, totalSpent: 41.3 })
  })

  it('devuelve 0 si el cliente no tiene órdenes y falla si no existe', async () => {
    const { repo } = inMemoryOrders()
    const useCase = new CalculateTotalSpentByCustomer(repo, customers(1))
    assert.equal((await useCase.execute(1)).totalSpent, 0)
    await assert.rejects(useCase.execute(2), NotFoundError)
  })
})
