import type { CustomerContract } from '../Domain/Contract/CustomerContract.ts'
import { customerNotFound } from './CustomerErrors.ts'

/** HU-06: eliminar un cliente (sus órdenes se eliminan en cascada). */
export class DeleteCustomerUseCase {
  private readonly customers: CustomerContract

  constructor(customers: CustomerContract) {
    this.customers = customers
  }

  async execute(id: number): Promise<void> {
    if (!(await this.customers.findById(id))) throw customerNotFound(id)
    await this.customers.delete(id)
  }
}
