import { DataTypes } from 'sequelize'
import type { Migration } from '../umzug.ts'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('order_items', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('order_items')
}
