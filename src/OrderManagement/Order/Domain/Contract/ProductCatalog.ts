export type CatalogProduct = { id: number; name: string; price: number }

/** Lo que el contexto de órdenes necesita saber de los productos. */
export interface ProductCatalog {
  findByIds(ids: number[]): Promise<CatalogProduct[]>
}
