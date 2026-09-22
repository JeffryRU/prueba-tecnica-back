export type SortDirection = 'asc' | 'desc'

export type PageRequest = { page: number; pageSize: number }

export type Page<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function buildPage<T>(items: T[], total: number, { page, pageSize }: PageRequest): Page<T> {
  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export function mapPage<T, R>(page: Page<T>, mapper: (item: T) => R): Page<R> {
  return { ...page, items: page.items.map(mapper) }
}
