import type { Request, Response } from 'express'
import { ok } from '../../shared/http/response.ts'
import { toUserResponse } from './user.mapper.ts'
import { UserModel } from './user.model.ts'

/** Listado de usuarios, útil para conocer los ids por los que filtrar los posts (HU-05). */
export async function listUsers(_req: Request, res: Response) {
  const users = await UserModel.findAll({ order: [['name', 'ASC']] })
  ok(res, users.map(toUserResponse))
}
