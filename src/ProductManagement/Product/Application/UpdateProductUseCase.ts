import type { ProductContract } from '../Domain/Contract/ProductContract.ts'
import type { ProductChanges, ProductPrimitives } from '../Domain/Entities/Product.ts'
import { findProductOrFail } from './FindProduct.ts'

export class UpdateProductUseCase {
  private readonly products: ProductContract

  constructor(products: ProductContract) {
    this.products = products
  }

  async execute(id: number, changes: ProductChanges): Promise<ProductPrimitives> {
    const product = await findProductOrFail(this.products, id)
    return (await this.products.save(product.update(changes))).toPrimitives()
  }
}
