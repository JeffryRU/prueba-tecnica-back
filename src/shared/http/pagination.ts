import { z } from 'zod'

export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

/** Query params `?page=&pageSize=` validados y con valores por defecto. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
})

export type PaginationParams = z.infer<typeof paginationSchema>

export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const sortDirectionSchema = z
  .enum(['asc', 'desc', 'ASC', 'DESC'])
  .transform((value) => value.toLowerCase() as 'asc' | 'desc')

export type SortDirection = z.infer<typeof sortDirectionSchema>

export function toOffset({ page, pageSize }: PaginationParams) {
  return { limit: pageSize, offset: (page - 1) * pageSize }
}

export function paginate<T>(items: T[], total: number, params: PaginationParams): Paginated<T> {
  return {
    items,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(total / params.pageSize),
  }
}
