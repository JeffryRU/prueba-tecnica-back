import { mapPage, type Page } from '../../../shared/domain/Pagination.ts'
import type { CustomerContract, CustomerCriteria } from '../Domain/Contract/CustomerContract.ts'
import type { CustomerPrimitives } from '../Domain/Entities/Customer.ts'

/** HU-04: listar clientes con paginación, filtro por nombre y orden por fecha de creación. */
export class ListCustomersUseCase {
  private readonly customers: CustomerContract

  constructor(customers: CustomerContract) {
    this.customers = customers
  }

  async execute(criteria: CustomerCriteria): Promise<Page<CustomerPrimitives>> {
    const page = await this.customers.search(criteria)
    return mapPage(page, (customer) => customer.toPrimitives())
  }
}
