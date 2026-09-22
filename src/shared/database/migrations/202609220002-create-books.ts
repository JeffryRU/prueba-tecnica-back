import { DataTypes } from 'sequelize'
import type { Migration } from '../umzug.ts'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('books', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.STRING(500), allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'authors', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  })
  await queryInterface.addIndex('books', ['author_id'])
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('books')
}
