import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize'
import { sequelize } from '../../../../shared/database/sequelize.ts'
import {
  PRODUCT_CATEGORIES,
  type ProductCategoryValue,
} from '../../Domain/ValueObjects/ProductCategory.ts'

export class ProductModel extends Model<
  InferAttributes<ProductModel>,
  InferCreationAttributes<ProductModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare category: ProductCategoryValue
  declare price: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

ProductModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: true } },
    category: {
      type: DataTypes.ENUM(...PRODUCT_CATEGORIES),
      allowNull: false,
      validate: { isIn: [[...PRODUCT_CATEGORIES]] },
    },
    price: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'products', modelName: 'Product' },
)
