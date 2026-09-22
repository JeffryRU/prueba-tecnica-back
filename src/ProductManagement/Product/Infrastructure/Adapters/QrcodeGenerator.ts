import QRCode from 'qrcode'
import type { QrCode, QrCodeGenerator, QrFormat } from '../../Domain/Contract/QrCodeGenerator.ts'

const options = { errorCorrectionLevel: 'M', margin: 2, width: 320 } as const

/** Adaptador del puerto QrCodeGenerator con la librería `qrcode`. */
export class QrcodeGenerator implements QrCodeGenerator {
  async generate(text: string, format: QrFormat): Promise<QrCode> {
    if (format === 'svg') {
      return {
        mimeType: 'image/svg+xml',
        content: await QRCode.toString(text, { ...options, type: 'svg' }),
      }
    }
    return {
      mimeType: 'image/png',
      content: await QRCode.toBuffer(text, { ...options, type: 'png' }),
    }
  }
}
