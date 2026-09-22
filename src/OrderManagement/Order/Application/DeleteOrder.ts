import type { OrderContract } from '../Domain/Contract/OrderContract.ts'
import { findOrderOrFail } from './OrderErrors.ts'

export class DeleteOrder {
  private readonly orders: OrderContract

  constructor(orders: OrderContract) {
    this.orders = orders
  }

  async execute(id: number): Promise<void> {
    await findOrderOrFail(this.orders, id)
    await this.orders.delete(id)
  }
}
