import { Name } from '../../../../shared/domain/ValueObjects/Name.ts'
import { Price } from '../ValueObjects/Price.ts'
import { ProductCategory, type ProductCategoryValue } from '../ValueObjects/ProductCategory.ts'

export type ProductPrimitives = {
  id: number | null
  name: string
  category: ProductCategoryValue
  price: number
  createdAt: Date | null
  updatedAt: Date | null
}

type ProductProps = {
  id: number | null
  name: Name
  category: ProductCategory
  price: Price
  createdAt: Date | null
  updatedAt: Date | null
}

export type ProductChanges = { name?: string; category?: string; price?: number }

export class Product {
  readonly id: number | null
  readonly name: Name
  readonly category: ProductCategory
  readonly price: Price
  readonly createdAt: Date | null
  readonly updatedAt: Date | null

  private constructor(p: ProductProps) {
    this.id = p.id
    this.name = p.name
    this.category = p.category
    this.price = p.price
    this.createdAt = p.createdAt
    this.updatedAt = p.updatedAt
  }

  static create(props: { name: string; category: string; price: number }): Product {
    return new Product({
      id: null,
      name: Name.create(props.name),
      category: ProductCategory.create(props.category),
      price: Price.create(props.price),
      createdAt: null,
      updatedAt: null,
    })
  }

  static fromPrimitives(p: ProductPrimitives): Product {
    return new Product({
      ...p,
      name: Name.create(p.name),
      category: ProductCategory.create(p.category),
      price: Price.create(p.price),
    })
  }

  /** Devuelve una copia con los cambios aplicados (la entidad es inmutable). */
  update(changes: ProductChanges): Product {
    return new Product({
      ...this,
      name: changes.name === undefined ? this.name : Name.create(changes.name),
      category:
        changes.category === undefined ? this.category : ProductCategory.create(changes.category),
      price: changes.price === undefined ? this.price : Price.create(changes.price),
    })
  }

  /** Texto que se codifica en el QR: al escanearlo se leen los datos del producto. */
  toQrContent(): string {
    return [
      `Producto #${this.id}`,
      `Nombre: ${this.name.value}`,
      `Categoría: ${this.category.value}`,
      `Precio: $${this.price.value.toFixed(2)}`,
    ].join('\n')
  }

  toPrimitives(): ProductPrimitives {
    return {
      id: this.id,
      name: this.name.value,
      category: this.category.value,
      price: this.price.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
