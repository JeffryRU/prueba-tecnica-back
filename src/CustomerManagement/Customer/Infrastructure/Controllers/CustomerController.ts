import type { Request, Response } from 'express'
import { idParamSchema } from '../../../../shared/http/params.ts'
import { created, noContent, ok } from '../../../../shared/http/response.ts'
import type { CreateCustomerUseCase } from '../../Application/CreateCustomerUseCase.ts'
import type { DeleteCustomerUseCase } from '../../Application/DeleteCustomerUseCase.ts'
import type { GetCustomerUseCase } from '../../Application/GetCustomerUseCase.ts'
import type { ListCustomersUseCase } from '../../Application/ListCustomersUseCase.ts'
import type { UpdateCustomerUseCase } from '../../Application/UpdateCustomerUseCase.ts'
import {
  createCustomerValidator,
  listCustomersValidator,
  replaceCustomerValidator,
  updateCustomerValidator,
} from '../Validators/CustomerValidators.ts'

export type CustomerUseCases = {
  create: CreateCustomerUseCase
  list: ListCustomersUseCase
  get: GetCustomerUseCase
  update: UpdateCustomerUseCase
  delete: DeleteCustomerUseCase
}

export class CustomerController {
  private readonly useCases: CustomerUseCases

  constructor(useCases: CustomerUseCases) {
    this.useCases = useCases
  }

  list = async (req: Request, res: Response) => {
    ok(res, await this.useCases.list.execute(listCustomersValidator.parse(req.query)))
  }

  show = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    ok(res, await this.useCases.get.execute(id))
  }

  create = async (req: Request, res: Response) => {
    const input = createCustomerValidator.parse(req.body)
    created(res, await this.useCases.create.execute(input), 'Cliente creado')
  }

  replace = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = replaceCustomerValidator.parse(req.body)
    ok(res, await this.useCases.update.execute(id, input), 'Cliente actualizado')
  }

  update = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = updateCustomerValidator.parse(req.body)
    ok(res, await this.useCases.update.execute(id, input), 'Cliente actualizado')
  }

  remove = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    await this.useCases.delete.execute(id)
    noContent(res)
  }
}
