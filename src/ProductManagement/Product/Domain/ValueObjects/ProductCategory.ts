import { InvalidArgumentError } from '../../../../shared/domain/DomainError.ts'

export const PRODUCT_CATEGORIES = ['Electronics', 'Clothing', 'Books'] as const

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number]

export class ProductCategory {
  readonly value: ProductCategoryValue

  private constructor(value: ProductCategoryValue) {
    this.value = value
  }

  static create(raw: string): ProductCategory {
    if (!ProductCategory.isValid(raw)) {
      throw new InvalidArgumentError(
        'INVALID_CATEGORY',
        `La categoría debe ser una de: ${PRODUCT_CATEGORIES.join(', ')}`,
      )
    }
    return new ProductCategory(raw)
  }

  static isValid(raw: string): raw is ProductCategoryValue {
    return (PRODUCT_CATEGORIES as readonly string[]).includes(raw)
  }
}
