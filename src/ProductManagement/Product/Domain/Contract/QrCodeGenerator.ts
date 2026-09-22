export type QrFormat = 'png' | 'svg'

export type QrCode = { mimeType: string; content: Buffer | string }

/** Puerto para generar códigos QR a partir de un texto. */
export interface QrCodeGenerator {
  generate(text: string, format: QrFormat): Promise<QrCode>
}
