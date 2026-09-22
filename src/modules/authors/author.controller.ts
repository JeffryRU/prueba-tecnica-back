import type { Request, Response } from 'express'
import { idParamSchema } from '../../shared/http/params.ts'
import { created, noContent, ok } from '../../shared/http/response.ts'
import { toAuthorResponse } from './author.mapper.ts'
import { createAuthorSchema, replaceAuthorSchema, updateAuthorSchema } from './author.schemas.ts'
import type { AuthorService } from './author.service.ts'

export class AuthorController {
  private readonly service: AuthorService

  constructor(service: AuthorService) {
    this.service = service
  }

  list = async (_req: Request, res: Response) => {
    const authors = await this.service.list()
    ok(res, authors.map(toAuthorResponse))
  }

  show = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    ok(res, toAuthorResponse(await this.service.findById(id)))
  }

  create = async (req: Request, res: Response) => {
    const input = createAuthorSchema.parse(req.body)
    created(res, toAuthorResponse(await this.service.create(input)), 'Autor creado')
  }

  replace = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = replaceAuthorSchema.parse(req.body)
    ok(res, toAuthorResponse(await this.service.update(id, input)), 'Autor actualizado')
  }

  update = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = updateAuthorSchema.parse(req.body)
    ok(res, toAuthorResponse(await this.service.update(id, input)), 'Autor actualizado')
  }

  remove = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    await this.service.remove(id)
    noContent(res)
  }
}
