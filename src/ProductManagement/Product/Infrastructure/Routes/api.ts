import { crudRouter } from '../../../../shared/http/crudRouter.ts'
import { CreateProductUseCase } from '../../Application/CreateProductUseCase.ts'
import { DeleteProductUseCase } from '../../Application/DeleteProductUseCase.ts'
import { GenerateQrUseCase } from '../../Application/GenerateQrUseCase.ts'
import { GetProductUseCase } from '../../Application/GetProductUseCase.ts'
import { ListProductsUseCase } from '../../Application/ListProductsUseCase.ts'
import { UpdateProductUseCase } from '../../Application/UpdateProductUseCase.ts'
import type { ProductContract } from '../../Domain/Contract/ProductContract.ts'
import type { QrCodeGenerator } from '../../Domain/Contract/QrCodeGenerator.ts'
import { ProductController } from '../Controllers/ProductController.ts'
import { QrController } from '../Controllers/QrController.ts'

type Dependencies = { products: ProductContract; qr: QrCodeGenerator }

export function productRouter({ products, qr }: Dependencies) {
  const qrController = new QrController(new GenerateQrUseCase(products, qr))

  return crudRouter(
    new ProductController({
      create: new CreateProductUseCase(products),
      list: new ListProductsUseCase(products),
      get: new GetProductUseCase(products),
      update: new UpdateProductUseCase(products),
      delete: new DeleteProductUseCase(products),
    }),
  ).get('/:id/qr', qrController.show)
}
