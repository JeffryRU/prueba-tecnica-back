import type { OrderContract } from '../Domain/Contract/OrderContract.ts'
import type { OrderPrimitives } from '../Domain/Entities/Order.ts'
import { findOrderOrFail } from './OrderErrors.ts'

export type UpdateOrderInput = { status?: string; shippingAddress?: string | null }

/** Actualiza el estado (respetando transiciones) y/o la dirección de envío. */
export class UpdateOrder {
  private readonly orders: OrderContract

  constructor(orders: OrderContract) {
    this.orders = orders
  }

  async execute(id: number, input: UpdateOrderInput): Promise<OrderPrimitives> {
    let order = await findOrderOrFail(this.orders, id)
    if (input.shippingAddress !== undefined)
      order = order.changeShippingAddress(input.shippingAddress)
    if (input.status !== undefined) order = order.changeStatus(input.status)
    return (await this.orders.save(order)).toPrimitives()
  }
}
