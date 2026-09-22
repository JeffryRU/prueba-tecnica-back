import type { ProductContract } from '../Domain/Contract/ProductContract.ts'
import { findProductOrFail } from './FindProduct.ts'

export class DeleteProductUseCase {
  private readonly products: ProductContract

  constructor(products: ProductContract) {
    this.products = products
  }

  async execute(id: number): Promise<void> {
    await findProductOrFail(this.products, id)
    await this.products.delete(id)
  }
}
