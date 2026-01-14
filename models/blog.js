import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db.js'

class Blog extends Model {}

Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    year: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1991,
            max: new Date().getFullYear(),
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog',
})

export default Blog