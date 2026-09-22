import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from 'sequelize'
import { sequelize } from '../../shared/database/sequelize.ts'
import type { BookModel } from '../books/book.model.ts'

export class AuthorModel extends Model<
  InferAttributes<AuthorModel>,
  InferCreationAttributes<AuthorModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare email: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  declare books?: NonAttribute<BookModel[]>
}

AuthorModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'El nombre es obligatorio' } },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { name: 'email', msg: 'El email ya está registrado' },
      validate: { isEmail: { msg: 'El email no es válido' } },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'authors', modelName: 'Author' },
)
