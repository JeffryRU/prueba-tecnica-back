import { z } from 'zod'
import { PASSWORD_POLICY, PASSWORD_POLICY_MESSAGE } from './password.policy.ts'

const email = z.email('El email no es válido').trim().toLowerCase().max(150)

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(100),
  email,
  password: z.string().regex(PASSWORD_POLICY, PASSWORD_POLICY_MESSAGE).max(72),
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
