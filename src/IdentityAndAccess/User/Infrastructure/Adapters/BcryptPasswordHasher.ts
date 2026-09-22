import bcrypt from 'bcryptjs'
import type { PasswordHasher } from '../../Domain/Contract/PasswordHasher.ts'

const SALT_ROUNDS = 10

export class BcryptPasswordHasher implements PasswordHasher {
  hash(plain: string) {
    return bcrypt.hash(plain, SALT_ROUNDS)
  }

  compare(plain: string, hash: string) {
    return bcrypt.compare(plain, hash)
  }
}
