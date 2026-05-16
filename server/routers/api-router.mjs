import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import controllers from './controllers/index.mjs'
import middleware from '../middleware/index.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `profile_${Date.now()}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/
    const valid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)
    valid ? cb(null, true) : cb(new Error('Only image files are allowed'))
  }
})

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
apiRouter.get('/patients/:patientId/clinical-notes', controllers.doctor.getClinicalNotes)
apiRouter.post('/patients/:patientId/clinical-notes', controllers.doctor.addClinicalNote)

// Patient's own clinical notes
apiRouter.get('/clinical-notes', controllers.doctor.getPatientOwnNotes)
apiRouter.patch('/clinical-notes/:noteId/read', controllers.doctor.markNoteAsRead)

// Profile routes
apiRouter.get('/profile', controllers.profile.getProfile)
apiRouter.put('/profile', controllers.profile.updateProfile)
apiRouter.post('/profile/picture', upload.single('picture'), controllers.profile.uploadPicture)

export default apiRouter
