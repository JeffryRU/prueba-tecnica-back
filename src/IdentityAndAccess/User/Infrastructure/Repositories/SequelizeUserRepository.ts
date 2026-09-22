import type { Email } from '../../../../shared/domain/ValueObjects/Email.ts'
import type { UserContract } from '../../Domain/Contract/UserContract.ts'
import { User } from '../../Domain/Entities/User.ts'
import { UserModel } from '../Models/UserModel.ts'

const toDomain = (model: UserModel) =>
  User.fromPrimitives({
    id: model.id,
    name: model.name,
    email: model.email,
    passwordHash: model.password,
    createdAt: model.createdAt,
  })

export class SequelizeUserRepository implements UserContract {
  async save(user: User): Promise<User> {
    const { name, email, passwordHash } = user.toPrimitives()
    return toDomain(await UserModel.create({ name, email, password: passwordHash }))
  }

  async findByEmail(email: Email): Promise<User | null> {
    const model = await UserModel.findOne({ where: { email: email.value } })
    return model && toDomain(model)
  }
}
