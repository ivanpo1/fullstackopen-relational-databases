import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db.js'

class ActiveSession extends Model {
}

ActiveSession.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id'},
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'activeSession',
  tableName: 'active_sessions',
})

export default ActiveSession