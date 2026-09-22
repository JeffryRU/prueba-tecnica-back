import type { Request, Response } from 'express'
import { idParamSchema } from '../../../../shared/http/params.ts'
import { created, noContent, ok } from '../../../../shared/http/response.ts'
import type { CreateProductUseCase } from '../../Application/CreateProductUseCase.ts'
import type { DeleteProductUseCase } from '../../Application/DeleteProductUseCase.ts'
import type { GetProductUseCase } from '../../Application/GetProductUseCase.ts'
import type { ListProductsUseCase } from '../../Application/ListProductsUseCase.ts'
import type { UpdateProductUseCase } from '../../Application/UpdateProductUseCase.ts'
import {
  createProductValidator,
  listProductsValidator,
  replaceProductValidator,
  updateProductValidator,
} from '../Validators/ProductValidators.ts'

export type ProductUseCases = {
  create: CreateProductUseCase
  list: ListProductsUseCase
  get: GetProductUseCase
  update: UpdateProductUseCase
  delete: DeleteProductUseCase
}

export class ProductController {
  private readonly useCases: ProductUseCases

  constructor(useCases: ProductUseCases) {
    this.useCases = useCases
  }

  list = async (req: Request, res: Response) => {
    ok(res, await this.useCases.list.execute(listProductsValidator.parse(req.query)))
  }

  show = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    ok(res, await this.useCases.get.execute(id))
  }

  create = async (req: Request, res: Response) => {
    const input = createProductValidator.parse(req.body)
    created(res, await this.useCases.create.execute(input), 'Producto creado')
  }

  replace = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = replaceProductValidator.parse(req.body)
    ok(res, await this.useCases.update.execute(id, input), 'Producto actualizado')
  }

  update = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = updateProductValidator.parse(req.body)
    ok(res, await this.useCases.update.execute(id, input), 'Producto actualizado')
  }

  remove = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    await this.useCases.delete.execute(id)
    noContent(res)
  }
}
