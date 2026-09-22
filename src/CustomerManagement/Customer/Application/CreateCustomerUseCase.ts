import type { CustomerContract } from '../Domain/Contract/CustomerContract.ts'
import { Customer, type CustomerPrimitives } from '../Domain/Entities/Customer.ts'
import { customerEmailTaken } from './CustomerErrors.ts'

export type CreateCustomerInput = { name: string; email: string }

/** HU-03: crear clientes. */
export class CreateCustomerUseCase {
  private readonly customers: CustomerContract

  constructor(customers: CustomerContract) {
    this.customers = customers
  }

  async execute(input: CreateCustomerInput): Promise<CustomerPrimitives> {
    const customer = Customer.create(input)
    if (await this.customers.findByEmail(customer.email)) throw customerEmailTaken()
    return (await this.customers.save(customer)).toPrimitives()
  }
}
