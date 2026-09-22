import type { CustomerContract } from '../Domain/Contract/CustomerContract.ts'
import type { CustomerPrimitives } from '../Domain/Entities/Customer.ts'
import { customerNotFound } from './CustomerErrors.ts'

export class GetCustomerUseCase {
  private readonly customers: CustomerContract

  constructor(customers: CustomerContract) {
    this.customers = customers
  }

  async execute(id: number): Promise<CustomerPrimitives> {
    const customer = await this.customers.findById(id)
    if (!customer) throw customerNotFound(id)
    return customer.toPrimitives()
  }
}
