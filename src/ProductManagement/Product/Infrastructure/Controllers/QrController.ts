import type { Request, Response } from 'express'
import { idParamSchema } from '../../../../shared/http/params.ts'
import type { GenerateQrUseCase } from '../../Application/GenerateQrUseCase.ts'
import { qrValidator } from '../Validators/ProductValidators.ts'

export class QrController {
  private readonly generateQr: GenerateQrUseCase

  constructor(generateQr: GenerateQrUseCase) {
    this.generateQr = generateQr
  }

  /** GET /products/:id/qr?format=png|svg → imagen del QR */
  show = async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params)
    const { format } = qrValidator.parse(req.query)
    const qr = await this.generateQr.execute(id, format)
    res.type(qr.mimeType).send(qr.content)
  }
}
