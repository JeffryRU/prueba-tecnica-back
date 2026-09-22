import type { Page, PageRequest } from '../../../../shared/domain/Pagination.ts'
import type { Order } from '../Entities/Order.ts'
import type { OrderStatusValue } from '../ValueObjects/OrderStatus.ts'

export type OrderCriteria = PageRequest & { customerId?: number; status?: OrderStatusValue }

/** Puerto de persistencia de órdenes. */
export interface OrderContract {
  /** Inserta la orden con sus productos si no tiene id; si lo tiene, actualiza estado y envío. */
  save(order: Order): Promise<Order>
  findById(id: number): Promise<Order | null>
  /** Todas las órdenes de un cliente, de la más reciente a la más antigua. */
  findByCustomer(customerId: number): Promise<Order[]>
  search(criteria: OrderCriteria): Promise<Page<Order>>
  delete(id: number): Promise<void>
}
