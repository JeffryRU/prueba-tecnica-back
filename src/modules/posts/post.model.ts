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
import { UserModel } from '../users/user.model.ts'

export class PostModel extends Model<
  InferAttributes<PostModel>,
  InferCreationAttributes<PostModel>
> {
  declare id: CreationOptional<number>
  declare title: string
  declare content: string
  declare userId: ForeignKey<UserModel['id']>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  declare user?: NonAttribute<UserModel>
}

PostModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: { msg: 'El título es obligatorio' } },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: 'El contenido es obligatorio' } },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'posts', modelName: 'Post' },
)

// Un usuario tiene muchos posts; al eliminar el usuario se eliminan sus posts.
UserModel.hasMany(PostModel, { as: 'posts', foreignKey: 'userId', onDelete: 'CASCADE' })
PostModel.belongsTo(UserModel, { as: 'user', foreignKey: 'userId' })
