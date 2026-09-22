import { NotFoundError } from '../../../shared/domain/DomainError.ts'
import type { CustomerDirectory } from '../Domain/Contract/CustomerDirectory.ts'
import type { OrderContract } from '../Domain/Contract/OrderContract.ts'
import type { Order } from '../Domain/Entities/Order.ts'

export const orderNotFound = (id: number) =>
  new NotFoundError('ORDER_NOT_FOUND', `La orden con id ${id} no existe`)

export async function ensureCustomerExists(customers: CustomerDirectory, customerId: number) {
  if (!(await customers.exists(customerId))) {
    throw new NotFoundError('CUSTOMER_NOT_FOUND', `El cliente con id ${customerId} no existe`)
  }
}

export async function findOrderOrFail(orders: OrderContract, id: number): Promise<Order> {
  const order = await orders.findById(id)
  if (!order) throw orderNotFound(id)
  return order
}
