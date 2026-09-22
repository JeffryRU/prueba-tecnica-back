import type { ProductContract } from '../../../../ProductManagement/Product/Domain/Contract/ProductContract.ts'
import type { CatalogProduct, ProductCatalog } from '../../Domain/Contract/ProductCatalog.ts'

/** Traduce el contexto de productos al puerto que necesita el contexto de órdenes. */
export class ProductCatalogAdapter implements ProductCatalog {
  private readonly products: ProductContract

  constructor(products: ProductContract) {
    this.products = products
  }

  async findByIds(ids: number[]): Promise<CatalogProduct[]> {
    const products = await this.products.findByIds(ids)
    return products.map((product) => ({
      id: product.id!,
      name: product.name.value,
      price: product.price.value,
    }))
  }
}
