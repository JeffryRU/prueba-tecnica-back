import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from 'sequelize'
import { sequelize } from '../../shared/database/sequelize.ts'
import { AuthorModel } from '../authors/author.model.ts'

export class BookModel extends Model<
  InferAttributes<BookModel>,
  InferCreationAttributes<BookModel>
> {
  declare id: CreationOptional<number>
  declare title: string
  declare description: string
  declare price: number
  declare authorId: ForeignKey<AuthorModel['id']>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  declare author?: NonAttribute<AuthorModel>
}

BookModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: { msg: 'El título es obligatorio' } },
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: { notEmpty: { msg: 'La descripción es obligatoria' } },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: 'El precio debe ser numérico' },
        min: { args: [0], msg: 'El precio no puede ser negativo' },
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'books', modelName: 'Book' },
)

// Relación 1:N — un autor tiene muchos libros; al eliminar el autor se eliminan sus libros.
AuthorModel.hasMany(BookModel, { as: 'books', foreignKey: 'authorId', onDelete: 'CASCADE' })
BookModel.belongsTo(AuthorModel, { as: 'author', foreignKey: 'authorId' })
