import type { PostModel } from './post.model.ts'

export type PostResponse = {
  id: number
  title: string
  content: string
  userId: number
  author: { id: number; name: string } | null
  createdAt: Date
  updatedAt: Date
}

export function toPostResponse(post: PostModel): PostResponse {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    userId: post.userId,
    author: post.user ? { id: post.user.id, name: post.user.name } : null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }
}
