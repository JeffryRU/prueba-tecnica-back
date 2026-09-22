import bcrypt from 'bcryptjs'

export interface PasswordHasher {
  hash(plain: string): Promise<string>
  compare(plain: string, hash: string): Promise<boolean>
}

const SALT_ROUNDS = 10

export const bcryptPasswordHasher: PasswordHasher = {
  hash: (plain) => bcrypt.hash(plain, SALT_ROUNDS),
  compare: (plain, hash) => bcrypt.compare(plain, hash),
}
