import { Router } from 'express'
import { CalculateTotalSpentByCustomer } from '../../Application/CalculateTotalSpentByCustomer.ts'
import { CreateOrder } from '../../Application/CreateOrder.ts'
import { DeleteOrder } from '../../Application/DeleteOrder.ts'
import { GetOrder } from '../../Application/GetOrder.ts'
import { ListOrders } from '../../Application/ListOrders.ts'
import { ListOrdersByCustomer } from '../../Application/ListOrdersByCustomer.ts'
import { UpdateOrder } from '../../Application/UpdateOrder.ts'
import type { CustomerDirectory } from '../../Domain/Contract/CustomerDirectory.ts'
import type { OrderContract } from '../../Domain/Contract/OrderContract.ts'
import type { ProductCatalog } from '../../Domain/Contract/ProductCatalog.ts'
import { OrderController } from '../Controllers/OrderController.ts'

type Dependencies = { orders: OrderContract; customers: CustomerDirectory; catalog: ProductCatalog }

/**
 * Devuelve dos routers:
 * - `orders`: /orders (CRUD de órdenes)
 * - `customerOrders`: /customers/:customerId/orders y /customers/:customerId/total-spent
 */
export function orderRouters({ orders, customers, catalog }: Dependencies) {
  const controller = new OrderController({
    create: new CreateOrder(orders, customers, catalog),
    list: new ListOrders(orders),
    get: new GetOrder(orders),
    update: new UpdateOrder(orders),
    delete: new DeleteOrder(orders),
    listByCustomer: new ListOrdersByCustomer(orders, customers),
    totalSpent: new CalculateTotalSpentByCustomer(orders, customers),
  })

  return {
    orders: Router()
      .get('/', controller.list)
      .get('/:id', controller.show)
      .post('/', controller.create)
      .patch('/:id', controller.update)
      .delete('/:id', controller.remove),
    customerOrders: Router({ mergeParams: true })
      .get('/orders', controller.listByCustomer)
      .get('/total-spent', controller.totalSpent),
  }
}
