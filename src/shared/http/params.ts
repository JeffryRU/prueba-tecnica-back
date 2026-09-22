import { z } from 'zod'

/** Valida un parámetro `:id` numérico positivo. */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})
