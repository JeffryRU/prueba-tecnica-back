import { ConflictError, InvalidArgumentError } from '../../../../shared/domain/DomainError.ts'

export const ORDER_STATUSES = ['pending', 'processing', 'completed', 'declined'] as const

export type OrderStatusValue = (typeof ORDER_STATUSES)[number]

/** Transiciones permitidas: completed y declined son estados finales. */
const TRANSITIONS: Record<OrderStatusValue, readonly OrderStatusValue[]> = {
  pending: ['processing', 'declined'],
  processing: ['completed', 'declined'],
  completed: [],
  declined: [],
}

export class OrderStatus {
  readonly value: OrderStatusValue

  private constructor(value: OrderStatusValue) {
    this.value = value
  }

  static pending() {
    return new OrderStatus('pending')
  }

  static create(raw: string): OrderStatus {
    if (!(ORDER_STATUSES as readonly string[]).includes(raw)) {
      throw new InvalidArgumentError(
        'INVALID_ORDER_STATUS',
        `El estado debe ser uno de: ${ORDER_STATUSES.join(', ')}`,
      )
    }
    return new OrderStatus(raw as OrderStatusValue)
  }

  transitionTo(next: OrderStatus): OrderStatus {
    if (next.value === this.value) return this
    if (!TRANSITIONS[this.value].includes(next.value)) {
      throw new ConflictError(
        'INVALID_STATUS_TRANSITION',
        `No se puede pasar una orden de "${this.value}" a "${next.value}"`,
      )
    }
    return next
  }

  isFinal() {
    return TRANSITIONS[this.value].length === 0
  }
}
