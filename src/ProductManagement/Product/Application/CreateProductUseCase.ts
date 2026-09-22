import type { ProductContract } from '../Domain/Contract/ProductContract.ts'
import { Product, type ProductPrimitives } from '../Domain/Entities/Product.ts'

export type CreateProductInput = { name: string; category: string; price: number }

/** HU-07: crear productos. */
export class CreateProductUseCase {
  private readonly products: ProductContract

  constructor(products: ProductContract) {
    this.products = products
  }

  async execute(input: CreateProductInput): Promise<ProductPrimitives> {
    return (await this.products.save(Product.create(input))).toPrimitives()
  }
}
