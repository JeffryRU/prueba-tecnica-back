import { InvalidArgumentError } from '../../../../shared/domain/DomainError.ts'

const MAX_QUANTITY = 1000

/** Cantidad de un producto en una orden: entero entre 1 y 1000. */
export class Quantity {
  readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(raw: number): Quantity {
    if (!Number.isInteger(raw) || raw < 1 || raw > MAX_QUANTITY) {
      throw new InvalidArgumentError(
        'INVALID_QUANTITY',
        `La cantidad debe ser un entero entre 1 y ${MAX_QUANTITY}`,
      )
    }
    return new Quantity(raw)
  }
}
