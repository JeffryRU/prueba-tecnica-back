import type { ProductContract } from '../Domain/Contract/ProductContract.ts'
import type { Product } from '../Domain/Entities/Product.ts'
import { productNotFound } from './ProductErrors.ts'

/** Obtiene un producto o lanza PRODUCT_NOT_FOUND. Compartido por los casos de uso. */
export async function findProductOrFail(products: ProductContract, id: number): Promise<Product> {
  const product = await products.findById(id)
  if (!product) throw productNotFound(id)
  return product
}
