import { Router } from 'express'
import { customerRouter } from './CustomerManagement/Customer/Infrastructure/Routes/Router.ts'
import { SequelizeCustomerRepository } from './CustomerManagement/Customer/Infrastructure/Repositories/SequelizeCustomerRepository.ts'
import { BcryptPasswordHasher } from './IdentityAndAccess/User/Infrastructure/Adapters/BcryptPasswordHasher.ts'
import { JwtTokenService } from './IdentityAndAccess/User/Infrastructure/Adapters/JwtTokenService.ts'
import { authenticate } from './IdentityAndAccess/User/Infrastructure/Middleware/Authenticate.ts'
import { SequelizeUserRepository } from './IdentityAndAccess/User/Infrastructure/Repositories/SequelizeUserRepository.ts'
import { authRouter } from './IdentityAndAccess/User/Infrastructure/Routes/Router.ts'
import { CustomerDirectoryAdapter } from './OrderManagement/Order/Infrastructure/Adapters/CustomerDirectoryAdapter.ts'
import { ProductCatalogAdapter } from './OrderManagement/Order/Infrastructure/Adapters/ProductCatalogAdapter.ts'
import { SequelizeOrderRepository } from './OrderManagement/Order/Infrastructure/Repositories/SequelizeOrderRepository.ts'
import { orderRouters } from './OrderManagement/Order/Infrastructure/Routes/Router.ts'
import { QrcodeGenerator } from './ProductManagement/Product/Infrastructure/Adapters/QrcodeGenerator.ts'
import { SequelizeProductRepository } from './ProductManagement/Product/Infrastructure/Repositories/SequelizeProductRepository.ts'
import { productRouter } from './ProductManagement/Product/Infrastructure/Routes/api.ts'

/**
 * Raíz de composición: el único lugar que conoce las implementaciones concretas.
 * Crea los adaptadores de infraestructura y los inyecta en cada bounded context.
 */
export function apiRouter() {
  const tokens = new JwtTokenService()
  const customers = new SequelizeCustomerRepository()
  const products = new SequelizeProductRepository()

  const orders = orderRouters({
    orders: new SequelizeOrderRepository(),
    customers: new CustomerDirectoryAdapter(customers),
    catalog: new ProductCatalogAdapter(products),
  })

  const protectedRoutes = Router()
    .use(authenticate(tokens))
    .use('/customers', customerRouter(customers))
    .use('/customers/:customerId', orders.customerOrders)
    .use('/products', productRouter({ products, qr: new QrcodeGenerator() }))
    .use('/orders', orders.orders)

  return Router()
    .use(
      '/auth',
      authRouter({
        users: new SequelizeUserRepository(),
        hasher: new BcryptPasswordHasher(),
        tokens,
      }),
    )
    .use(protectedRoutes)
}
