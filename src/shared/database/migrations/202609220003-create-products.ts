import { DataTypes } from 'sequelize'
import type { Migration } from '../umzug.ts'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('products', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    category: { type: DataTypes.ENUM('Electronics', 'Clothing', 'Books'), allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  })
  await queryInterface.addIndex('products', ['category'])
  await queryInterface.addIndex('products', ['price'])
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('products')
}
