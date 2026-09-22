import type { CustomerContract } from '../Domain/Contract/CustomerContract.ts'
import type { CustomerPrimitives } from '../Domain/Entities/Customer.ts'
import { customerEmailTaken, customerNotFound } from './CustomerErrors.ts'

export type UpdateCustomerInput = { name?: string; email?: string }

/** HU-05: actualizar la información de un cliente. */
export class UpdateCustomerUseCase {
  private readonly customers: CustomerContract

  constructor(customers: CustomerContract) {
    this.customers = customers
  }

  async execute(id: number, changes: UpdateCustomerInput): Promise<CustomerPrimitives> {
    const current = await this.customers.findById(id)
    if (!current) throw customerNotFound(id)

    const updated = current.update(changes)
    if (!updated.email.equals(current.email)) {
      const owner = await this.customers.findByEmail(updated.email)
      if (owner && owner.id !== id) throw customerEmailTaken()
    }
    return (await this.customers.save(updated)).toPrimitives()
  }
}
