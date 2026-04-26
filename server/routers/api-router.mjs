import express from 'express'
import controllers from './controllers/index.mjs'
import middleware from '../middleware/index.mjs'

const apiRouter = express.Router()
apiRouter.use(middleware.auth)

// Daily Log routes
apiRouter.post('/daily-logs', controllers.dailyLog.create)
apiRouter.get('/daily-logs', controllers.dailyLog.getAll)

// Cycle History/Medical Form routes
apiRouter.get('/cycle-history', controllers.cycle.getCycleHistory)
apiRouter.post('/cycle-history', controllers.cycle.upsertCycleHistory)
apiRouter.put('/cycle-history', controllers.cycle.upsertCycleHistory)

// Doctor routes
apiRouter.get('/doctors', controllers.doctor.getAllDoctors)
apiRouter.get('/doctors/assigned', controllers.doctor.getAssignedDoctor)
apiRouter.post('/doctors/assign', controllers.doctor.assignDoctorToPatient)
apiRouter.delete('/doctors/unassign', controllers.doctor.unassignDoctor)

// Patient list for doctors
apiRouter.get('/patients', controllers.doctor.getMyPatients)
apiRouter.get('/patients/:patientId/logs', controllers.doctor.getPatientLogs)
apiRouter.get('/patients/:patientId/cycle-history', controllers.doctor.getPatientCycleHistory)

export default apiRouter
