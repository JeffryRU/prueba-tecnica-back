import type { Request, Response } from 'express'
import { idParamSchema } from '../../shared/http/params.ts'
import { created, noContent, ok } from '../../shared/http/response.ts'
import { currentUser } from '../auth/auth.middleware.ts'
import { toPostResponse } from './post.mapper.ts'
import {
  createPostSchema,
  listPostsQuerySchema,
  replacePostSchema,
  updatePostSchema,
} from './post.schemas.ts'
import type { PostService } from './post.service.ts'

export class PostController {
  private readonly service: PostService

  constructor(service: PostService) {
    this.service = service
  }

  list = async (req: Request, res: Response) => {
    const query = listPostsQuerySchema.parse(req.query)
    const page = await this.service.list(query, currentUser(req).id)
    ok(res, { ...page, items: page.items.map(toPostResponse) })
  }

  show = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    ok(res, toPostResponse(await this.service.findById(id)))
  }

  create = async (req: Request, res: Response) => {
    const input = createPostSchema.parse(req.body)
    created(
      res,
      toPostResponse(await this.service.create(input, currentUser(req).id)),
      'Post creado',
    )
  }

  replace = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = replacePostSchema.parse(req.body)
    const post = await this.service.update(id, input, currentUser(req).id)
    ok(res, toPostResponse(post), 'Post actualizado')
  }

  update = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const input = updatePostSchema.parse(req.body)
    const post = await this.service.update(id, input, currentUser(req).id)
    ok(res, toPostResponse(post), 'Post actualizado')
  }

  remove = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    await this.service.remove(id, currentUser(req).id)
    noContent(res)
  }
}
