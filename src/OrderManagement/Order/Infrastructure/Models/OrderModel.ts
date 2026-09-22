import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from 'sequelize'
import { sequelize } from '../../../../shared/database/sequelize.ts'
import { ORDER_STATUSES, type OrderStatusValue } from '../../Domain/ValueObjects/OrderStatus.ts'
import type { OrderItemModel } from './OrderItemModel.ts'

export class OrderModel extends Model<
  InferAttributes<OrderModel>,
  InferCreationAttributes<OrderModel>
> {
  declare id: CreationOptional<number>
  declare status: CreationOptional<OrderStatusValue>
  declare total: number | null
  declare shippingAddress: string | null
  declare shippedAt: Date | null
  declare customerId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  declare items?: NonAttribute<OrderItemModel[]>
}

OrderModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: {
      type: DataTypes.ENUM(...ORDER_STATUSES),
      allowNull: false,
      defaultValue: 'pending',
      validate: { isIn: [[...ORDER_STATUSES]] },
    },
    total: { type: DataTypes.FLOAT, allowNull: true },
    shippingAddress: { type: DataTypes.TEXT, allowNull: true },
    shippedAt: { type: DataTypes.DATE, allowNull: true },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'orders', modelName: 'Order' },
)
