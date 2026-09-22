import type { CustomerContract } from '../../../../CustomerManagement/Customer/Domain/Contract/CustomerContract.ts'
import type { CustomerDirectory } from '../../Domain/Contract/CustomerDirectory.ts'

/** Traduce el contexto de clientes al puerto que necesita el contexto de órdenes. */
export class CustomerDirectoryAdapter implements CustomerDirectory {
  private readonly customers: CustomerContract

  constructor(customers: CustomerContract) {
    this.customers = customers
  }

  async exists(customerId: number) {
    return (await this.customers.findById(customerId)) !== null
  }
}
