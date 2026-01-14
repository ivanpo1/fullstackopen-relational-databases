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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id'},
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'activeSession',
  tableName: 'active_sessions',
})

export default ActiveSession