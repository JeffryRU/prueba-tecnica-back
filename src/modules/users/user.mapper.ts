import type { UserModel } from './user.model.ts'

export type UserResponse = { id: number; name: string; email: string; createdAt: Date }

export function toUserResponse(user: UserModel): UserResponse {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
}
