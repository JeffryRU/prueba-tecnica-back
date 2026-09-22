import { DataTypes } from 'sequelize'
import type { Migration } from '../umzug.ts'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('orders', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'declined'),
      allowNull: false,
      defaultValue: 'pending',
    },
    total: { type: DataTypes.FLOAT, allowNull: true },
    shipping_address: { type: DataTypes.TEXT, allowNull: true },
    shipped_at: { type: DataTypes.DATE, allowNull: true },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'customers', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  })
  await queryInterface.addIndex('orders', ['customer_id', 'created_at'])
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('orders')
}
