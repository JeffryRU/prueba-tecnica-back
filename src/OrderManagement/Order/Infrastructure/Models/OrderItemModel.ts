import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from 'sequelize'
import { sequelize } from '../../../../shared/database/sequelize.ts'
import { ProductModel } from '../../../../ProductManagement/Product/Infrastructure/Models/ProductModel.ts'
import { OrderModel } from './OrderModel.ts'

/** Tabla intermedia orden ⇄ producto con la cantidad. */
export class OrderItemModel extends Model<
  InferAttributes<OrderItemModel>,
  InferCreationAttributes<OrderItemModel>
> {
  declare id: CreationOptional<number>
  declare orderId: number
  declare productId: number
  declare quantity: CreationOptional<number>

  declare product?: NonAttribute<ProductModel>
}

OrderItemModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
    },
  },
  { sequelize, tableName: 'order_items', modelName: 'OrderItem', timestamps: false },
)

OrderModel.hasMany(OrderItemModel, { as: 'items', foreignKey: 'orderId', onDelete: 'CASCADE' })
OrderItemModel.belongsTo(OrderModel, { foreignKey: 'orderId' })
// Solo lectura: el precio unitario y el nombre se leen del producto al consultar la orden.
OrderItemModel.belongsTo(ProductModel, { as: 'product', foreignKey: 'productId' })
