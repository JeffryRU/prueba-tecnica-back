import type { Request, Response } from 'express'
import { idParamSchema } from '../../../../shared/http/params.ts'
import { created, noContent, ok } from '../../../../shared/http/response.ts'
import type { CalculateTotalSpentByCustomer } from '../../Application/CalculateTotalSpentByCustomer.ts'
import type { CreateOrder } from '../../Application/CreateOrder.ts'
import type { DeleteOrder } from '../../Application/DeleteOrder.ts'
import type { GetOrder } from '../../Application/GetOrder.ts'
import type { ListOrders } from '../../Application/ListOrders.ts'
import type { ListOrdersByCustomer } from '../../Application/ListOrdersByCustomer.ts'
import type { UpdateOrder } from '../../Application/UpdateOrder.ts'
import {
  createOrderValidator,
  customerIdParamValidator,
  listOrdersValidator,
  updateOrderValidator,
} from '../Validators/OrderValidators.ts'

export type OrderUseCases = {
  create: CreateOrder
  list: ListOrders
  get: GetOrder
  update: UpdateOrder
  delete: DeleteOrder
  listByCustomer: ListOrdersByCustomer
  totalSpent: CalculateTotalSpentByCustomer
}

export class OrderController {
  private readonly useCases: OrderUseCases

  constructor(useCases: OrderUseCases) {
    this.useCases = useCases
  }

  list = async (req: Request, res: Response) => {
    ok(res, await this.useCases.list.execute(listOrdersValidator.parse(req.query)))
  }

  show = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    ok(res, await this.useCases.get.execute(id))
  }

  create = async (req: Request, res: Response) => {
    const input = createOrderValidator.parse(req.body)
    created(res, await this.useCases.create.execute(input), 'Orden creada')
  }

  update = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = updateOrderValidator.parse(req.body)
    ok(res, await this.useCases.update.execute(id, input), 'Orden actualizada')
  }

  remove = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    await this.useCases.delete.execute(id)
    noContent(res)
  }

  /** GET /customers/:customerId/orders (HU-10) */
  listByCustomer = async (req: Request, res: Response) => {
    const { customerId } = customerIdParamValidator.parse(req.params)
    ok(res, await this.useCases.listByCustomer.execute(customerId))
  }

  /** GET /customers/:customerId/total-spent (HU-11) */
  totalSpent = async (req: Request, res: Response) => {
    const { customerId } = customerIdParamValidator.parse(req.params)
    ok(res, await this.useCases.totalSpent.execute(customerId))
  }
}
