import type { Page, PageRequest, SortDirection } from '../../../../shared/domain/Pagination.ts'
import type { Email } from '../../../../shared/domain/ValueObjects/Email.ts'
import type { Customer } from '../Entities/Customer.ts'

export type CustomerCriteria = PageRequest & {
  /** Coincidencia parcial por nombre. */
  name?: string
  /** Orden por fecha de creación. */
  sort: SortDirection
}

/** Puerto de persistencia de clientes. */
export interface CustomerContract {
  /** Inserta si no tiene id; si lo tiene, actualiza. */
  save(customer: Customer): Promise<Customer>
  findById(id: number): Promise<Customer | null>
  findByEmail(email: Email): Promise<Customer | null>
  search(criteria: CustomerCriteria): Promise<Page<Customer>>
  delete(id: number): Promise<void>
}
