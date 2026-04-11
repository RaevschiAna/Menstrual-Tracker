import Sequelize from 'sequelize'
import createClinicalNoteEntity from './clinicalNote.mjs'
import createCycleEntity from './cycle.mjs'
import createDaylyLogEntity from './daylyLog.mjs'
import createDoctorEntity from './doctor.mjs'
import createNotificationEntity from './notification.mjs'
import createPatientEntity from './patient.mjs'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db',
  logQueryParameters: true
})

const clinicalNote=createClinicalNoteEntity(sequelize,Sequelize)
const cycle=createCycleEntity(sequelize,Sequelize)
const daylyLog=createDaylyLogEntity(sequelize,Sequelize)
const doctor=createDoctorEntity(sequelize,Sequelize)
const notification=createNotificationEntity(sequelize,Sequelize)
const patient= createPatientEntity(sequelize,Sequelize)

doctor.belongsToMany(patient, {
  through: "doctor_patient",
  foreignKey: "doctorId"
})

doctor.hasMany(notification)
notification.belongsTo(doctor)

doctor.hasMany(clinicalNote)
clinicalNote.belongsTo(doctor)

patient.belongsToMany(doctor, {
  through: "doctor_patient",
  foreignKey: "patientId"
})

patient.hasMany(notification)
notification.belongsTo(patient)

patient.hasMany(clinicalNote)
clinicalNote.belongsTo(patient)

patient.hasMany(daylyLog)
daylyLog.belongsTo(patient)

patient.hasMany(cycle)
cycle.belongsTo(patient)

try {
  await sequelize.sync({
    alter: true
  })
} catch (err) {
  console.warn(err)
}

export default {
  sequelize,
  clinicalNote,
  cycle,
  daylyLog,
  doctor,
  notification,
  patient
}