import { crudRouter } from '../../../../shared/http/crudRouter.ts'
import { CreateCustomerUseCase } from '../../Application/CreateCustomerUseCase.ts'
import { DeleteCustomerUseCase } from '../../Application/DeleteCustomerUseCase.ts'
import { GetCustomerUseCase } from '../../Application/GetCustomerUseCase.ts'
import { ListCustomersUseCase } from '../../Application/ListCustomersUseCase.ts'
import { UpdateCustomerUseCase } from '../../Application/UpdateCustomerUseCase.ts'
import type { CustomerContract } from '../../Domain/Contract/CustomerContract.ts'
import { CustomerController } from '../Controllers/CustomerController.ts'

export function customerRouter(customers: CustomerContract) {
  return crudRouter(
    new CustomerController({
      create: new CreateCustomerUseCase(customers),
      list: new ListCustomersUseCase(customers),
      get: new GetCustomerUseCase(customers),
      update: new UpdateCustomerUseCase(customers),
      delete: new DeleteCustomerUseCase(customers),
    }),
  )
}
