import { z } from 'zod'

// Validación de forma (tipos y obligatorios). Las reglas de negocio —formato de email,
// política de contraseña— viven en los value objects del dominio.
export const registerValidator = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
})

export const loginValidator = z.object({
  email: z.string().min(1, 'El email es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})
