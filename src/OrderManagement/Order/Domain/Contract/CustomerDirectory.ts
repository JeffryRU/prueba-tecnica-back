/** Lo que el contexto de órdenes necesita saber de los clientes. */
export interface CustomerDirectory {
  exists(customerId: number): Promise<boolean>
}
