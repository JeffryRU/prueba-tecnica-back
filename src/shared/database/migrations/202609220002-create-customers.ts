import { DataTypes } from 'sequelize'
import type { Migration } from '../umzug.ts'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('customers', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  })
  await queryInterface.addIndex('customers', ['name'])
  await queryInterface.addIndex('customers', ['created_at'])
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('customers')
}
