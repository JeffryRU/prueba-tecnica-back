import { z } from 'zod'
import { paginationSchema, sortDirectionSchema } from '../../../../shared/http/pagination.ts'
import { PRODUCT_CATEGORIES } from '../../Domain/ValueObjects/ProductCategory.ts'

export const createProductValidator = z.object({
  name: z.string(),
  category: z.string(),
  price: z.number('El precio debe ser numérico'),
})

export const replaceProductValidator = createProductValidator

export const updateProductValidator = createProductValidator
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo')

/** GET /products?page=&pageSize=&category=&sort=asc|desc (orden por precio) */
export const listProductsValidator = paginationSchema
  .extend({
    category: z.enum(PRODUCT_CATEGORIES).optional(),
    sort: sortDirectionSchema.optional(),
  })
  .transform(({ sort, ...rest }) => ({ ...rest, sortByPrice: sort }))

export const qrValidator = z.object({ format: z.enum(['png', 'svg']).default('png') })
