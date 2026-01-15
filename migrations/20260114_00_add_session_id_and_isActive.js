import { DataTypes } from 'sequelize'

export const up = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('active_sessions', 'isActive', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  await queryInterface.addColumn('active_sessions', 'session_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
}

export const down = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('active_sessions', 'isActive')
  await queryInterface.removeColumn('active_sessions', 'session_id')
}