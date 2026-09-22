import { InvalidArgumentError } from '../../../../shared/domain/DomainError.ts'
import { roundMoney } from '../../../../shared/domain/money.ts'

const MAX_PRICE = 1_000_000

/** Precio unitario: número finito, no negativo, redondeado a 2 decimales. */
export class Price {
  readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(raw: number): Price {
    if (!Number.isFinite(raw) || raw < 0 || raw > MAX_PRICE) {
      throw new InvalidArgumentError(
        'INVALID_PRICE',
        `El precio debe ser un número entre 0 y ${MAX_PRICE}`,
      )
    }
    return new Price(roundMoney(raw))
  }

  multiply(quantity: number): number {
    return roundMoney(this.value * quantity)
  }
}
