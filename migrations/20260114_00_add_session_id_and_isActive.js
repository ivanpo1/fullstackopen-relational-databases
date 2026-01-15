import { DataTypes } from 'sequelize'

export const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('active_sessions', 'is_active', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  await queryInterface.addColumn('active_sessions', 'session_id', {
    type: DataTypes.STRING,
    allowNull: false,
  })
}

export const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('active_sessions', 'is_active')
  await queryInterface.removeColumn('active_sessions', 'session_id')
}