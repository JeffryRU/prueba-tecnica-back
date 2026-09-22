import type { BookModel } from '../books/book.model.ts'
import type { AuthorModel } from './author.model.ts'

export type AuthorSummary = { id: number; name: string; email: string }

export type AuthorResponse = AuthorSummary & {
  createdAt: Date
  updatedAt: Date
  books?: { id: number; title: string; price: number }[]
}

export function toAuthorSummary(author: AuthorModel): AuthorSummary {
  return { id: author.id, name: author.name, email: author.email }
}

export function toAuthorResponse(author: AuthorModel): AuthorResponse {
  return {
    ...toAuthorSummary(author),
    createdAt: author.createdAt,
    updatedAt: author.updatedAt,
    ...(author.books && {
      books: author.books.map(({ id, title, price }: BookModel) => ({ id, title, price })),
    }),
  }
}
