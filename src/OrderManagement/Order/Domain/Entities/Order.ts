import { ConflictError, InvalidArgumentError } from '../../../../shared/domain/DomainError.ts'
import { roundMoney } from '../../../../shared/domain/money.ts'
import { OrderStatus, type OrderStatusValue } from '../ValueObjects/OrderStatus.ts'
import { OrderItem, type OrderItemPrimitives } from './OrderItem.ts'

export type OrderPrimitives = {
  id: number | null
  customerId: number
  status: OrderStatusValue
  shippingAddress: string | null
  shippedAt: Date | null
  createdAt: Date | null
  items: OrderItemPrimitives[]
  total: number
}

type OrderProps = {
  id: number | null
  customerId: number
  status: OrderStatus
  shippingAddress: string | null
  shippedAt: Date | null
  createdAt: Date | null
  items: OrderItem[]
}

export type NewOrderItem = {
  productId: number
  productName: string
  unitPrice: number
  quantity: number
}

export class Order {
  readonly id: number | null
  readonly customerId: number
  readonly status: OrderStatus
  readonly shippingAddress: string | null
  readonly shippedAt: Date | null
  readonly createdAt: Date | null
  readonly items: readonly OrderItem[]

  private constructor(p: OrderProps) {
    this.id = p.id
    this.customerId = p.customerId
    this.status = p.status
    this.shippingAddress = p.shippingAddress
    this.shippedAt = p.shippedAt
    this.createdAt = p.createdAt
    this.items = p.items
  }

  /** Nueva orden en estado `pending`. Si un producto se repite, se suman sus cantidades. */
  static create(props: {
    customerId: number
    items: NewOrderItem[]
    shippingAddress?: string | null
  }) {
    if (props.items.length === 0) {
      throw new InvalidArgumentError('EMPTY_ORDER', 'La orden debe tener al menos un producto')
    }
    return new Order({
      id: null,
      customerId: props.customerId,
      status: OrderStatus.pending(),
      shippingAddress: props.shippingAddress?.trim() || null,
      shippedAt: null,
      createdAt: null,
      items: mergeByProduct(props.items).map(OrderItem.create),
    })
  }

  static fromPrimitives(p: Omit<OrderPrimitives, 'total'>): Order {
    return new Order({
      ...p,
      status: OrderStatus.create(p.status),
      items: p.items.map(OrderItem.create),
    })
  }

  /** Total de la orden: Σ (precio unitario × cantidad) de sus productos. */
  total(): number {
    return roundMoney(this.items.reduce((sum, item) => sum + item.subtotal(), 0))
  }

  /** Cambia el estado respetando las transiciones; al completarse registra la fecha de envío. */
  changeStatus(raw: string): Order {
    const status = this.status.transitionTo(OrderStatus.create(raw))
    const shippedAt = status.value === 'completed' ? (this.shippedAt ?? new Date()) : this.shippedAt
    return new Order({ ...this, items: [...this.items], status, shippedAt })
  }

  changeShippingAddress(address: string | null): Order {
    if (this.status.isFinal()) {
      throw new ConflictError(
        'ORDER_CLOSED',
        'No se puede cambiar la dirección de una orden completada o rechazada',
      )
    }
    return new Order({ ...this, items: [...this.items], shippingAddress: address?.trim() || null })
  }

  toPrimitives(): OrderPrimitives {
    return {
      id: this.id,
      customerId: this.customerId,
      status: this.status.value,
      shippingAddress: this.shippingAddress,
      shippedAt: this.shippedAt,
      createdAt: this.createdAt,
      items: this.items.map((item) => item.toPrimitives()),
      total: this.total(),
    }
  }
}

function mergeByProduct(items: NewOrderItem[]): NewOrderItem[] {
  const merged = new Map<number, NewOrderItem>()
  for (const item of items) {
    const existing = merged.get(item.productId)
    merged.set(
      item.productId,
      existing ? { ...existing, quantity: existing.quantity + item.quantity } : item,
    )
  }
  return [...merged.values()]
}
