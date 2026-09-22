import { roundMoney } from '../../../../shared/domain/money.ts'
import { Quantity } from '../ValueObjects/Quantity.ts'

export type OrderItemPrimitives = {
  productId: number
  productName: string
  unitPrice: number
  quantity: number
  subtotal: number
}

/** Producto asociado a una orden con su cantidad y precio unitario. */
export class OrderItem {
  readonly productId: number
  readonly productName: string
  readonly unitPrice: number
  readonly quantity: Quantity

  private constructor(
    productId: number,
    productName: string,
    unitPrice: number,
    quantity: Quantity,
  ) {
    this.productId = productId
    this.productName = productName
    this.unitPrice = unitPrice
    this.quantity = quantity
  }

  static create(props: {
    productId: number
    productName: string
    unitPrice: number
    quantity: number
  }) {
    return new OrderItem(
      props.productId,
      props.productName,
      props.unitPrice,
      Quantity.create(props.quantity),
    )
  }

  /** Precio unitario × cantidad. */
  subtotal(): number {
    return roundMoney(this.unitPrice * this.quantity.value)
  }

  toPrimitives(): OrderItemPrimitives {
    return {
      productId: this.productId,
      productName: this.productName,
      unitPrice: this.unitPrice,
      quantity: this.quantity.value,
      subtotal: this.subtotal(),
    }
  }
}
