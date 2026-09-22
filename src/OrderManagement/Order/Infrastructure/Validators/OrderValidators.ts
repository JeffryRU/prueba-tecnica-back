import { z } from 'zod'
import { paginationSchema } from '../../../../shared/http/pagination.ts'
import { ORDER_STATUSES } from '../../Domain/ValueObjects/OrderStatus.ts'

export const createOrderValidator = z.object({
  customerId: z.number().int().positive(),
  shippingAddress: z.string().max(500).nullish(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().default(1),
      }),
    )
    .min(1, 'La orden debe tener al menos un producto'),
})

export const updateOrderValidator = z
  .object({
    status: z.string(),
    shippingAddress: z.string().max(500).nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar status o shippingAddress')

/** GET /orders?page=&pageSize=&customerId=&status= */
export const listOrdersValidator = paginationSchema.extend({
  customerId: z.coerce.number().int().positive().optional(),
  status: z.enum(ORDER_STATUSES).optional(),
})

export const customerIdParamValidator = z.object({
  customerId: z.coerce.number().int().positive(),
})
