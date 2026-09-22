import { mapPage, type Page } from '../../../shared/domain/Pagination.ts'
import type { OrderContract, OrderCriteria } from '../Domain/Contract/OrderContract.ts'
import type { OrderPrimitives } from '../Domain/Entities/Order.ts'

export class ListOrders {
  private readonly orders: OrderContract

  constructor(orders: OrderContract) {
    this.orders = orders
  }

  async execute(criteria: OrderCriteria): Promise<Page<OrderPrimitives>> {
    return mapPage(await this.orders.search(criteria), (order) => order.toPrimitives())
  }
}
