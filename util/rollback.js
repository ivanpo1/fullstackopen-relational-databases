import { rollbackMigration } from './db.js'

rollbackMigration().then(() => console.log('Rollback Done'))