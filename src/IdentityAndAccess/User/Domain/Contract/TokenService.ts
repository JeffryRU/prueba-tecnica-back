export type AuthUser = { id: number; email: string }

export interface TokenService {
  sign(user: AuthUser): string
  /** Devuelve el usuario del token o `null` si es inválido o expiró. */
  verify(token: string): AuthUser | null
}
