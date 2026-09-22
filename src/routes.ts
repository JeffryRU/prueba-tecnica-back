import { Router } from 'express'
import { crudRouter } from './shared/http/crudRouter.ts'
import { AuthorController } from './modules/authors/author.controller.ts'
import { AuthorService } from './modules/authors/author.service.ts'
import { BookController } from './modules/books/book.controller.ts'
import { BookService } from './modules/books/book.service.ts'

/** Raíz de composición: crea las dependencias y monta los routers de cada módulo. */
export function apiRouter() {
  const authorService = new AuthorService()
  const bookService = new BookService(authorService)

  return Router()
    .use('/authors', crudRouter(new AuthorController(authorService)))
    .use('/books', crudRouter(new BookController(bookService)))
}
