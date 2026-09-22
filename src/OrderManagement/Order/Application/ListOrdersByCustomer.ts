import type { CustomerDirectory } from '../Domain/Contract/CustomerDirectory.ts'
import type { OrderContract } from '../Domain/Contract/OrderContract.ts'
import type { OrderPrimitives } from '../Domain/Entities/Order.ts'
import { ensureCustomerExists } from './OrderErrors.ts'

/** HU-10: historial de órdenes de un cliente con productos, cantidades y precios. */
export class ListOrdersByCustomer {
  private readonly orders: OrderContract
  private readonly customers: CustomerDirectory

  constructor(orders: OrderContract, customers: CustomerDirectory) {
    this.orders = orders
    this.customers = customers
  }

  async execute(customerId: number): Promise<OrderPrimitives[]> {
    await ensureCustomerExists(this.customers, customerId)
    const orders = await this.orders.findByCustomer(customerId)
    return orders.map((order) => order.toPrimitives())
  }
}
