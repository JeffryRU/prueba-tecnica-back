import { ConflictError, NotFoundError } from '../../../shared/domain/DomainError.ts'

export const customerNotFound = (id: number) =>
  new NotFoundError('CUSTOMER_NOT_FOUND', `El cliente con id ${id} no existe`)

export const customerEmailTaken = () =>
  new ConflictError('EMAIL_ALREADY_EXISTS', 'Ya existe un cliente con ese email')
