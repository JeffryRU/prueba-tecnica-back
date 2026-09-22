import { z } from 'zod'
import { paginationSchema, sortDirectionSchema } from '../../../../shared/http/pagination.ts'

export const createCustomerValidator = z.object({ name: z.string(), email: z.string() })

export const replaceCustomerValidator = createCustomerValidator

export const updateCustomerValidator = createCustomerValidator
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo')

/** GET /customers?page=&pageSize=&name=&sort=asc|desc */
export const listCustomersValidator = paginationSchema.extend({
  name: z.string().trim().min(1).max(100).optional(),
  sort: sortDirectionSchema.default('desc'),
})
