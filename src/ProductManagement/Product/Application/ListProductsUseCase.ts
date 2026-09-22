import { mapPage, type Page } from '../../../shared/domain/Pagination.ts'
import type { ProductContract, ProductCriteria } from '../Domain/Contract/ProductContract.ts'
import type { ProductPrimitives } from '../Domain/Entities/Product.ts'

/** HU-08: listar productos con filtro por categoría y orden por precio. */
export class ListProductsUseCase {
  private readonly products: ProductContract

  constructor(products: ProductContract) {
    this.products = products
  }

  async execute(criteria: ProductCriteria): Promise<Page<ProductPrimitives>> {
    const page = await this.products.search(criteria)
    return mapPage(page, (product) => product.toPrimitives())
  }
}
