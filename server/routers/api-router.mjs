import express from 'express'
import controllers from './controllers/index.mjs'
import middleware from '../middleware/index.mjs'

const apiRouter = express.Router()
apiRouter.use(middleware.auth)

// Daily Log routes
apiRouter.post('/daily-logs', controllers.dailyLog.create)
apiRouter.get('/daily-logs', controllers.dailyLog.getAll)

export default apiRouter
