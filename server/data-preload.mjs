import models from './models/index.mjs'
import bcrypt from 'bcrypt'

const hash1 = bcrypt.hashSync('welcome', 10)
const hash2 = bcrypt.hashSync('welcome', 10)

// Insert first patient, silently ignore if exists
models.patient.create({
  email: 'john@patient.net',
  passwordHash: hash1,
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-05-15',
  height: 180,
  weight: 75,
  notes: 'Patient notes here'
}).catch(() => { /* silently ignore duplicate */ })

// Insert second patient, silently ignore if exists
setTimeout(() => {
  models.patient.create({
    email: 'jane@patient.net',
    passwordHash: hash2,
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1992-08-22',
    height: 165,
    weight: 60,
    notes: 'Another patient'
  }).catch(() => { /* silently ignore duplicate */ })
}, 500)