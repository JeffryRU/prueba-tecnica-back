import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize'
import { sequelize } from '../../shared/database/sequelize.ts'
import { bcryptPasswordHasher } from '../auth/password.hasher.ts'
import { PASSWORD_POLICY, PASSWORD_POLICY_MESSAGE } from '../auth/password.policy.ts'

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare email: string
  declare password: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

UserModel.init(
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // Se valida la contraseña en texto plano; el hook la reemplaza por su hash antes de guardar.
      validate: { is: { args: PASSWORD_POLICY, msg: PASSWORD_POLICY_MESSAGE } },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    defaultScope: { attributes: { exclude: ['password'] } },
    scopes: { withPassword: { attributes: { include: ['password'] } } },
    hooks: {
      // Las validaciones corren antes que este hook, así que la política se aplica al texto plano.
      beforeSave: async (user) => {
        if (user.changed('password')) user.password = await bcryptPasswordHasher.hash(user.password)
      },
    },
  },
)
