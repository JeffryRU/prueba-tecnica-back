import { DataTypes } from 'sequelize'
import type { Migration } from '../umzug.ts'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('posts', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_at: { type: DataTypes.DATE, allowNull: false },
    updated_at: { type: DataTypes.DATE, allowNull: false },
  })
  // Índices para los filtros y el orden más habituales
  await queryInterface.addIndex('posts', ['user_id', 'created_at'])
  await queryInterface.addIndex('posts', ['created_at'])
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('posts')
}
