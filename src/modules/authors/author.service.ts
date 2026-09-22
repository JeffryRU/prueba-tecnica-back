import { AppError } from '../../shared/errors/AppError.ts'
import { BookModel } from '../books/book.model.ts'
import { AuthorModel } from './author.model.ts'
import type { CreateAuthorInput, UpdateAuthorInput } from './author.schemas.ts'

export class AuthorService {
  list() {
    return AuthorModel.findAll({ order: [['name', 'ASC']] })
  }

  /** Detalle del autor con sus libros. */
  async findById(id: number) {
    const author = await AuthorModel.findByPk(id, {
      include: [{ model: BookModel, as: 'books', attributes: ['id', 'title', 'price'] }],
      order: [[{ model: BookModel, as: 'books' }, 'title', 'ASC']],
    })
    if (!author) throw AppError.notFound('El autor no existe', 'AUTHOR_NOT_FOUND')
    return author
  }

  async exists(id: number) {
    return (await AuthorModel.count({ where: { id } })) > 0
  }

  async create(input: CreateAuthorInput) {
    const author = await AuthorModel.create(input)
    return this.findById(author.id)
  }

  async update(id: number, input: UpdateAuthorInput) {
    const author = await this.findById(id)
    await author.update(input)
    return this.findById(id)
  }

  /** Elimina el autor y, en cascada, todos sus libros. */
  async remove(id: number) {
    const author = await this.findById(id)
    await author.destroy()
  }
}
