import type { OrderContract } from '../Domain/Contract/OrderContract.ts'
import type { OrderPrimitives } from '../Domain/Entities/Order.ts'
import { findOrderOrFail } from './OrderErrors.ts'

export class GetOrder {
  private readonly orders: OrderContract

  constructor(orders: OrderContract) {
    this.orders = orders
  }

  async execute(id: number): Promise<OrderPrimitives> {
    return (await findOrderOrFail(this.orders, id)).toPrimitives()
  }
}
