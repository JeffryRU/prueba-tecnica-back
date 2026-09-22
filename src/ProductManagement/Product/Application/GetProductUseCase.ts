import type { ProductContract } from '../Domain/Contract/ProductContract.ts'
import type { ProductPrimitives } from '../Domain/Entities/Product.ts'
import { findProductOrFail } from './FindProduct.ts'

export class GetProductUseCase {
  private readonly products: ProductContract

  constructor(products: ProductContract) {
    this.products = products
  }

  async execute(id: number): Promise<ProductPrimitives> {
    return (await findProductOrFail(this.products, id)).toPrimitives()
  }
}
