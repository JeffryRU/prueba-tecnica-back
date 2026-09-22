/**
 * CLI de base de datos.
 *   node src/shared/database/cli.ts <comando>
 *
 * Comandos: create | migrate | migrate:undo | migrate:reset | seed | seed:undo | reset
 */
import mysql from 'mysql2/promise'
import { env } from '../config/env.ts'
import { sequelize } from './sequelize.ts'
import { migrator, seeder } from './umzug.ts'

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  })
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )
  await connection.end()
  console.log(`✔ Base de datos "${env.DB_NAME}" lista`)
}

const commands: Record<string, () => Promise<unknown>> = {
  create: createDatabase,
  migrate: () => migrator.up(),
  'migrate:undo': () => migrator.down(),
  'migrate:reset': () => migrator.down({ to: 0 }),
  seed: () => seeder.up(),
  'seed:undo': () => seeder.down({ to: 0 }),
  reset: async () => {
    await seeder.down({ to: 0 })
    await migrator.down({ to: 0 })
    await migrator.up()
    await seeder.up()
  },
}

const name = process.argv[2] ?? ''
const command = commands[name]

if (!command) {
  console.error(`Comando desconocido: "${name}". Disponibles: ${Object.keys(commands).join(', ')}`)
  process.exit(1)
}

try {
  await command()
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  await sequelize.close()
}
