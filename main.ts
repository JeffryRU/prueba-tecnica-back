import { createApp } from './src/app.ts'
import { env } from './src/shared/config/env.ts'
import { sequelize } from './src/shared/database/sequelize.ts'

try {
  await sequelize.authenticate()
  console.log(`✔ Conectado a MySQL (${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME})`)
} catch (error) {
  console.error('❌ No se pudo conectar a la base de datos:', (error as Error).message)
  process.exit(1)
}

createApp().listen(env.PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${env.PORT}`)
})
