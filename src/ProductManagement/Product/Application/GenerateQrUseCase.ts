import type { ProductContract } from '../Domain/Contract/ProductContract.ts'
import type { QrCode, QrCodeGenerator, QrFormat } from '../Domain/Contract/QrCodeGenerator.ts'
import { findProductOrFail } from './FindProduct.ts'

/** HU-12: QR asociado a un producto que, al escanearlo, muestra sus datos. */
export class GenerateQrUseCase {
  private readonly products: ProductContract
  private readonly qr: QrCodeGenerator

  constructor(products: ProductContract, qr: QrCodeGenerator) {
    this.products = products
    this.qr = qr
  }

  async execute(id: number, format: QrFormat = 'png'): Promise<QrCode> {
    const product = await findProductOrFail(this.products, id)
    return this.qr.generate(product.toQrContent(), format)
  }
}
