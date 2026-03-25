import express from 'express'
import controllers from './controllers/index.mjs'
import middleware from '../middleware/index.mjs'

const apiRouter = express.Router()
apiRouter.use(middleware.auth)

// project endpoints
apiRouter.get('/users/:uid/projects', controllers.project.getAllProjects)
apiRouter.get('/users/:uid/projects/:pid', controllers.project.getOneOwnedProject)
apiRouter.post('/users/:uid/projects', controllers.project.createOwnedProject)
apiRouter.put('/users/:uid/projects/:pid', middleware.getPermMiddleware('pid', ['write']), controllers.project.updateOwnedProject)
apiRouter.delete('/users/:uid/projects/:pid', middleware.getPermMiddleware('pid', ['write']), controllers.project.deleteOwnedProject)


// get user profile
apiRouter.get('/users/:uid/profile', controllers.user.getUserProfile)

// suggest user based on email
apiRouter.get('/users/suggestions', controllers.user.suggestUser)

export default apiRouter
