import type { Email } from '../../../../shared/domain/ValueObjects/Email.ts'
import type { User } from '../Entities/User.ts'

/** Puerto de persistencia de usuarios. */
export interface UserContract {
  save(user: User): Promise<User>
  findByEmail(email: Email): Promise<User | null>
}
