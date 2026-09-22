import { Op } from 'sequelize'
import { buildPage, type Page } from '../../../../shared/domain/Pagination.ts'
import type { ProductContract, ProductCriteria } from '../../Domain/Contract/ProductContract.ts'
import { Product } from '../../Domain/Entities/Product.ts'
import { ProductModel } from '../Models/ProductModel.ts'

const toDomain = (model: ProductModel) => Product.fromPrimitives(model.get({ plain: true }))

export class SequelizeProductRepository implements ProductContract {
  async save(product: Product): Promise<Product> {
    const { id, name, category, price } = product.toPrimitives()
    if (id === null) return toDomain(await ProductModel.create({ name, category, price }))

    await ProductModel.update({ name, category, price }, { where: { id } })
    return toDomain((await ProductModel.findByPk(id))!)
  }

  async findById(id: number) {
    const model = await ProductModel.findByPk(id)
    return model && toDomain(model)
  }

  async findByIds(ids: number[]) {
    const models = await ProductModel.findAll({ where: { id: { [Op.in]: ids } } })
    return models.map(toDomain)
  }

  async search({ category, sortByPrice, page, pageSize }: ProductCriteria): Promise<Page<Product>> {
    const { rows, count } = await ProductModel.findAndCountAll({
      where: category ? { category } : {},
      order: sortByPrice
        ? [
            ['price', sortByPrice],
            ['id', 'asc'],
          ]
        : [['id', 'asc']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })
    return buildPage(rows.map(toDomain), count, { page, pageSize })
  }

  async delete(id: number) {
    await ProductModel.destroy({ where: { id } })
  }
}
