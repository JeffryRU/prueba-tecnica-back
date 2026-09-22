import { toAuthorSummary, type AuthorSummary } from '../authors/author.mapper.ts'
import type { BookModel } from './book.model.ts'

export type BookResponse = {
  id: number
  title: string
  description: string
  price: number
  authorId: number
  author: AuthorSummary | null
  createdAt: Date
  updatedAt: Date
}

export function toBookResponse(book: BookModel): BookResponse {
  return {
    id: book.id,
    title: book.title,
    description: book.description,
    price: book.price,
    authorId: book.authorId,
    author: book.author ? toAuthorSummary(book.author) : null,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  }
}
