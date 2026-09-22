import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Product } from '../../src/ProductManagement/Product/Domain/Entities/Product.ts'
import { Price } from '../../src/ProductManagement/Product/Domain/ValueObjects/Price.ts'
import { ProductCategory } from '../../src/ProductManagement/Product/Domain/ValueObjects/ProductCategory.ts'
import { InvalidArgumentError } from '../../src/shared/domain/DomainError.ts'
import { Email } from '../../src/shared/domain/ValueObjects/Email.ts'
import { Name } from '../../src/shared/domain/ValueObjects/Name.ts'

describe('Value objects', () => {
  it('Email normaliza y valida', () => {
    assert.equal(Email.create('  JUAN@Mail.COM ').value, 'juan@mail.com')
    assert.throws(() => Email.create('juan@'), InvalidArgumentError)
  })

  it('Name exige contenido', () => {
    assert.equal(Name.create('  Ana  ').value, 'Ana')
    assert.throws(() => Name.create('   '), InvalidArgumentError)
  })

  it('ProductCategory solo admite Electronics, Clothing y Books', () => {
    assert.equal(ProductCategory.create('Books').value, 'Books')
    assert.throws(() => ProductCategory.create('Toys'), InvalidArgumentError)
    assert.throws(() => ProductCategory.create('books'), InvalidArgumentError)
  })

  it('Price no admite negativos y redondea a 2 decimales', () => {
    assert.equal(Price.create(19.999).value, 20)
    assert.throws(() => Price.create(-1), InvalidArgumentError)
    assert.throws(() => Price.create(Number.NaN), InvalidArgumentError)
  })

  it('el contenido del QR incluye los datos del producto', () => {
    const product = Product.fromPrimitives({
      id: 7,
      name: 'Clean Code',
      category: 'Books',
      price: 32.9,
      createdAt: null,
      updatedAt: null,
    })
    assert.equal(
      product.toQrContent(),
      'Producto #7\nNombre: Clean Code\nCategoría: Books\nPrecio: $32.90',
    )
  })
})
