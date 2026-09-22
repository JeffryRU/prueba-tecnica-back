import type { WhereOptions } from 'sequelize'
import { AppError } from '../../shared/errors/AppError.ts'
import { paginate, toOffset } from '../../shared/http/pagination.ts'
import { UserModel } from '../users/user.model.ts'
import { PostModel } from './post.model.ts'
import type { CreatePostInput, ListPostsQuery, UpdatePostInput } from './post.schemas.ts'

const withAuthor = { model: UserModel, as: 'user', attributes: ['id', 'name'] }

export class PostService {
  /** Listado paginado con filtros por autor / propios y orden por fecha de creación. */
  async list(query: ListPostsQuery, currentUserId: number) {
    const { userId, mine, sort } = query
    if (mine && userId && userId !== currentUserId) {
      throw AppError.badRequest('No se puede combinar mine=true con el userId de otro usuario')
    }

    const authorId = mine ? currentUserId : userId
    const where: WhereOptions<PostModel> = authorId ? { userId: authorId } : {}

    const { rows, count } = await PostModel.findAndCountAll({
      where,
      include: [withAuthor],
      order: [
        ['createdAt', sort],
        ['id', sort],
      ],
      ...toOffset(query),
    })
    return paginate(rows, count, query)
  }

  async findById(id: number) {
    const post = await PostModel.findByPk(id, { include: [withAuthor] })
    if (!post) throw AppError.notFound('El post no existe', 'POST_NOT_FOUND')
    return post
  }

  async create(input: CreatePostInput, userId: number) {
    const post = await PostModel.create({ ...input, userId })
    return this.findById(post.id)
  }

  async update(id: number, input: UpdatePostInput, userId: number) {
    const post = await this.findOwned(id, userId)
    await post.update(input)
    return this.findById(id)
  }

  async remove(id: number, userId: number) {
    const post = await this.findOwned(id, userId)
    await post.destroy()
  }

  /** Solo el autor puede modificar o eliminar su post. */
  private async findOwned(id: number, userId: number) {
    const post = await this.findById(id)
    if (post.userId !== userId) {
      throw AppError.forbidden('Solo el autor puede modificar o eliminar este post')
    }
    return post
  }
}
