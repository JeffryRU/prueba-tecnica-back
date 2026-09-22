import express from 'express'
import { sequelize } from './shared/database/sequelize.ts'
import { errorHandler, notFoundHandler } from './shared/http/errorHandler.ts'

export function createApp() {
  const app = express()

  app.use(express.json())

  app.get('/health', async (_req, res) => {
    const database = await sequelize
      .authenticate()
      .then(() => 'up')
      .catch(() => 'down')
    const healthy = database === 'up'
    res.status(healthy ? 200 : 503).json({
      success: healthy,
      data: { status: healthy ? 'ok' : 'degraded', database },
    })
  })

  // Aquí se montan los routers de cada caso: app.use('/api/...', router)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
