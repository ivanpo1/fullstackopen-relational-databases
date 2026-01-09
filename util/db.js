import { Sequelize } from "sequelize";
import { DATABASE_URL } from './config.js'
import { Umzug, SequelizeStorage } from 'umzug'

export const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true,
    }
})

const migrationConfig = {
    migrations: {
        glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({
        sequelize, tableName: 'migrations'
    }),
    context: sequelize.getQueryInterface(),
    logger: console,
}

const runMigrations = async () => {
    const migrator = new Umzug(migrationConfig)
    const migrations = await migrator.up()
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name)
    })
}

export const rollbackMigration = async () => {
    await sequelize.authenticate()
    const migrator = new Umzug(migrationConfig)
    await migrator.down()
}

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        await runMigrations()
        console.log('Connected to the database')
    } catch (err) {
        console.log('Failed to connect to the database')
        console.log(err)
        return process.exit(1)
    }
    return null
}

