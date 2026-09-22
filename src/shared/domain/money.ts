/** Redondea importes a 2 decimales evitando errores de coma flotante (0.1 + 0.2). */
export const roundMoney = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100
