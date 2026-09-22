import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize'
import { sequelize } from '../../../../shared/database/sequelize.ts'

export class CustomerModel extends Model<
  InferAttributes<CustomerModel>,
  InferCreationAttributes<CustomerModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare email: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

CustomerModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, validate: { notEmpty: true } },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { name: 'email', msg: 'Ya existe un cliente con ese email' },
      validate: { isEmail: true },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'customers', modelName: 'Customer' },
)
