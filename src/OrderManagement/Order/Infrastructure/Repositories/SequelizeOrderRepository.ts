import type { WhereOptions } from 'sequelize'
import { sequelize } from '../../../../shared/database/sequelize.ts'
import { buildPage, type Page } from '../../../../shared/domain/Pagination.ts'
import type { OrderContract, OrderCriteria } from '../../Domain/Contract/OrderContract.ts'
import { Order } from '../../Domain/Entities/Order.ts'
import { OrderItemModel } from '../Models/OrderItemModel.ts'
import { OrderModel } from '../Models/OrderModel.ts'

const withItems = {
  model: OrderItemModel,
  as: 'items',
  include: [{ association: 'product', attributes: ['id', 'name', 'price'] }],
}

const toDomain = (model: OrderModel) =>
  Order.fromPrimitives({
    id: model.id,
    customerId: model.customerId,
    status: model.status,
    shippingAddress: model.shippingAddress,
    shippedAt: model.shippedAt,
    createdAt: model.createdAt,
    items: (model.items ?? []).map((item) => ({
      productId: item.productId,
      productName: item.product!.name,
      unitPrice: item.product!.price,
      quantity: item.quantity,
      subtotal: 0, // lo recalcula la entidad
    })),
  })

export class SequelizeOrderRepository implements OrderContract {
  async save(order: Order): Promise<Order> {
    const data = order.toPrimitives()
    const fields = {
      status: data.status,
      shippingAddress: data.shippingAddress,
      shippedAt: data.shippedAt,
      total: data.total,
    }

    if (data.id !== null) {
      await OrderModel.update(fields, { where: { id: data.id } })
      return (await this.findById(data.id))!
    }

    // La orden y sus productos se guardan de forma atómica.
    const id = await sequelize.transaction(async (transaction) => {
      const created = await OrderModel.create(
        { ...fields, customerId: data.customerId },
        { transaction },
      )
      await OrderItemModel.bulkCreate(
        data.items.map(({ productId, quantity }) => ({ orderId: created.id, productId, quantity })),
        { transaction },
      )
      return created.id
    })
    return (await this.findById(id))!
  }

  async findById(id: number) {
    const model = await OrderModel.findByPk(id, { include: [withItems] })
    return model && toDomain(model)
  }

  async findByCustomer(customerId: number) {
    const models = await OrderModel.findAll({
      where: { customerId },
      include: [withItems],
      order: [
        ['createdAt', 'desc'],
        ['id', 'desc'],
      ],
    })
    return models.map(toDomain)
  }

  async search({ customerId, status, page, pageSize }: OrderCriteria): Promise<Page<Order>> {
    const where: WhereOptions<OrderModel> = {
      ...(customerId && { customerId }),
      ...(status && { status }),
    }
    const { rows, count } = await OrderModel.findAndCountAll({
      where,
      include: [withItems],
      order: [['id', 'desc']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      distinct: true, // cuenta órdenes, no filas del join
    })
    return buildPage(rows.map(toDomain), count, { page, pageSize })
  }

  async delete(id: number) {
    await OrderModel.destroy({ where: { id } })
  }
}
