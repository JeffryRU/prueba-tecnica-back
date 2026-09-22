import { NotFoundError } from '../../../shared/domain/DomainError.ts'

export const productNotFound = (id: number) =>
  new NotFoundError('PRODUCT_NOT_FOUND', `El producto con id ${id} no existe`)
