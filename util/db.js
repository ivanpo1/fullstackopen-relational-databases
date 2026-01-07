import {Sequelize} from "sequelize";
import {DATABASE_URL} from './config.js'

export const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true,
    }
})

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connected to the database')
    } catch (err) {
        console.log('Failed to connect to the database')
        return process.exit(1)
    }

    return null
}

