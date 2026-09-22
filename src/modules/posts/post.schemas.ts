import { z } from 'zod'
import { paginationSchema, sortDirectionSchema } from '../../shared/http/pagination.ts'

export const createPostSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio').max(150),
  content: z.string().trim().min(1, 'El contenido es obligatorio').max(10_000),
})

/** PUT: reemplazo completo. */
export const replacePostSchema = createPostSchema

/** PATCH: actualización parcial (al menos un campo). */
export const updatePostSchema = createPostSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo')

/**
 * GET /posts
 *   ?page=1&pageSize=10     paginación (HU-04)
 *   ?userId=2               posts de un usuario (HU-05)
 *   ?mine=true              solo mis posts (HU-06)
 *   ?sort=desc|asc          orden por fecha de creación (HU-07)
 */
export const listPostsQuerySchema = paginationSchema.extend({
  userId: z.coerce.number().int().positive().optional(),
  mine: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  sort: sortDirectionSchema.default('desc'),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>
