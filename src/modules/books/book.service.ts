import { AppError } from '../../shared/errors/AppError.ts'
import { AuthorModel } from '../authors/author.model.ts'
import type { AuthorService } from '../authors/author.service.ts'
import { BookModel } from './book.model.ts'
import type { CreateBookInput, ListBooksQuery, UpdateBookInput } from './book.schemas.ts'

const withAuthor = { model: AuthorModel, as: 'author', attributes: ['id', 'name', 'email'] }

export class BookService {
  private readonly authors: Pick<AuthorService, 'exists'>

  constructor(authors: Pick<AuthorService, 'exists'>) {
    this.authors = authors
  }

  /** Lista todos los libros con su autor (opcionalmente filtrados por autor). */
  list({ authorId }: ListBooksQuery = {}) {
    return BookModel.findAll({
      where: authorId ? { authorId } : {},
      include: [withAuthor],
      order: [['id', 'ASC']],
    })
  }

  async findById(id: number) {
    const book = await BookModel.findByPk(id, { include: [withAuthor] })
    if (!book) throw AppError.notFound('El libro no existe', 'BOOK_NOT_FOUND')
    return book
  }

  async create(input: CreateBookInput) {
    await this.ensureAuthorExists(input.authorId)
    const book = await BookModel.create(input)
    return this.findById(book.id)
  }

  async update(id: number, input: UpdateBookInput) {
    const book = await this.findById(id)
    if (input.authorId !== undefined) await this.ensureAuthorExists(input.authorId)
    await book.update(input)
    return this.findById(id)
  }

  async remove(id: number) {
    const book = await this.findById(id)
    await book.destroy()
  }

  private async ensureAuthorExists(authorId: number) {
    if (!(await this.authors.exists(authorId))) {
      throw new AppError('AUTHOR_NOT_FOUND', `El autor con id ${authorId} no existe`, 422)
    }
  }
}
