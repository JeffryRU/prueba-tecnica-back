import { NotFoundError } from '../../../shared/domain/DomainError.ts'
import type { CustomerDirectory } from '../Domain/Contract/CustomerDirectory.ts'
import type { OrderContract } from '../Domain/Contract/OrderContract.ts'
import type { ProductCatalog } from '../Domain/Contract/ProductCatalog.ts'
import { Order, type OrderPrimitives } from '../Domain/Entities/Order.ts'
import { ensureCustomerExists } from './OrderErrors.ts'

export type CreateOrderInput = {
  customerId: number
  shippingAddress?: string | null
  items: { productId: number; quantity: number }[]
}

/** HU-09: crear una orden asociando productos a un cliente. */
export class CreateOrder {
  private readonly orders: OrderContract
  private readonly customers: CustomerDirectory
  private readonly catalog: ProductCatalog

  constructor(orders: OrderContract, customers: CustomerDirectory, catalog: ProductCatalog) {
    this.orders = orders
    this.customers = customers
    this.catalog = catalog
  }

  async execute(input: CreateOrderInput): Promise<OrderPrimitives> {
    await ensureCustomerExists(this.customers, input.customerId)

    const ids = [...new Set(input.items.map((item) => item.productId))]
    const products = new Map((await this.catalog.findByIds(ids)).map((p) => [p.id, p]))
    const missing = ids.filter((id) => !products.has(id))
    if (missing.length) {
      throw new NotFoundError('PRODUCT_NOT_FOUND', `Productos inexistentes: ${missing.join(', ')}`)
    }

    const order = Order.create({
      customerId: input.customerId,
      shippingAddress: input.shippingAddress,
      items: input.items.map(({ productId, quantity }) => {
        const product = products.get(productId)!
        return { productId, productName: product.name, unitPrice: product.price, quantity }
      }),
    })
    return (await this.orders.save(order)).toPrimitives()
  }
}
