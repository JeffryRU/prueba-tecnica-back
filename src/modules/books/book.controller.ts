import type { Request, Response } from 'express'
import { idParamSchema } from '../../shared/http/params.ts'
import { created, noContent, ok } from '../../shared/http/response.ts'
import { toBookResponse } from './book.mapper.ts'
import {
  createBookSchema,
  listBooksQuerySchema,
  replaceBookSchema,
  updateBookSchema,
} from './book.schemas.ts'
import type { BookService } from './book.service.ts'

export class BookController {
  private readonly service: BookService

  constructor(service: BookService) {
    this.service = service
  }

  list = async (req: Request, res: Response) => {
    const query = listBooksQuerySchema.parse(req.query)
    const books = await this.service.list(query)
    ok(res, books.map(toBookResponse))
  }

  show = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    ok(res, toBookResponse(await this.service.findById(id)))
  }

  create = async (req: Request, res: Response) => {
    const input = createBookSchema.parse(req.body)
    created(res, toBookResponse(await this.service.create(input)), 'Libro creado')
  }

  replace = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = replaceBookSchema.parse(req.body)
    ok(res, toBookResponse(await this.service.update(id, input)), 'Libro actualizado')
  }

  update = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = updateBookSchema.parse(req.body)
    ok(res, toBookResponse(await this.service.update(id, input)), 'Libro actualizado')
  }

  remove = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    await this.service.remove(id)
    noContent(res)
  }
}
