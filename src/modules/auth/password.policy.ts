/**
 * Política de contraseñas: mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.
 * Se reutiliza en la validación de entrada (Zod) y en el modelo de base de datos.
 */
export const PASSWORD_POLICY = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export const PASSWORD_POLICY_MESSAGE =
  'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial'
