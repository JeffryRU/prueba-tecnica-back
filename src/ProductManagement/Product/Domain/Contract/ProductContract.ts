import type { Page, PageRequest, SortDirection } from '../../../../shared/domain/Pagination.ts'
import type { Product } from '../Entities/Product.ts'
import type { ProductCategoryValue } from '../ValueObjects/ProductCategory.ts'

export type ProductCriteria = PageRequest & {
  category?: ProductCategoryValue
  /** Orden por precio; sin valor se ordena por id. */
  sortByPrice?: SortDirection
}

/** Puerto de persistencia de productos. */
export interface ProductContract {
  /** Inserta si no tiene id; si lo tiene, actualiza. */
  save(product: Product): Promise<Product>
  findById(id: number): Promise<Product | null>
  findByIds(ids: number[]): Promise<Product[]>
  search(criteria: ProductCriteria): Promise<Page<Product>>
  delete(id: number): Promise<void>
}
