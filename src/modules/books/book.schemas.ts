import { z } from 'zod'

export const createBookSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio').max(150),
  description: z.string().trim().min(1, 'La descripción es obligatoria').max(500),
  price: z.number('El precio debe ser numérico').min(0, 'El precio no puede ser negativo'),
  authorId: z.number().int().positive('authorId debe ser un id válido'),
})

/** PUT: reemplazo completo. */
export const replaceBookSchema = createBookSchema

/** PATCH: actualización parcial (al menos un campo). */
export const updateBookSchema = createBookSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo')

export const listBooksQuerySchema = z.object({
  authorId: z.coerce.number().int().positive().optional(),
})

export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>
export type ListBooksQuery = z.infer<typeof listBooksQuerySchema>
