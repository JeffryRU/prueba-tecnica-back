import { roundMoney } from '../../../shared/domain/money.ts'
import type { CustomerDirectory } from '../Domain/Contract/CustomerDirectory.ts'
import type { OrderContract } from '../Domain/Contract/OrderContract.ts'
import { ensureCustomerExists } from './OrderErrors.ts'

export type TotalSpent = { customerId: number; ordersCount: number; totalSpent: number }

/**
 * HU-11: total gastado por un cliente.
 * Recorre sus órdenes, multiplica el precio unitario de cada producto por su cantidad
 * (`Order.total()`) y suma los totales de todas las órdenes.
 */
export class CalculateTotalSpentByCustomer {
  private readonly orders: OrderContract
  private readonly customers: CustomerDirectory

  constructor(orders: OrderContract, customers: CustomerDirectory) {
    this.orders = orders
    this.customers = customers
  }

  async execute(customerId: number): Promise<TotalSpent> {
    await ensureCustomerExists(this.customers, customerId)
    const orders = await this.orders.findByCustomer(customerId)
    const totalSpent = roundMoney(orders.reduce((sum, order) => sum + order.total(), 0))
    return { customerId, ordersCount: orders.length, totalSpent }
  }
}
