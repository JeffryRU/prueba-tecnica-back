import { z } from 'zod'

export const createAuthorSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(100),
  email: z.email('El email no es válido').trim().toLowerCase().max(150),
})

/** PUT: reemplazo completo. */
export const replaceAuthorSchema = createAuthorSchema

/** PATCH: actualización parcial (al menos un campo). */
export const updateAuthorSchema = createAuthorSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo')

export type CreateAuthorInput = z.infer<typeof createAuthorSchema>
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>
