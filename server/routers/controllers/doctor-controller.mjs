import models from '../../models/index.mjs'

const getAllDoctors = async (req, res, next) => {
  try {
    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Only patients can view doctors' })
    }

    const doctors = await models.doctor.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'specialization', 'licenceNumber']
    })

    res.status(200).json(doctors)
  } catch (err) {
    next(err)
  }
}

const getAssignedDoctor = async (req, res, next) => {
  try {
    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Only patients can view their assigned doctor' })
    }

    const doctors = await req.user.getDoctors({
      attributes: ['id', 'firstName', 'lastName', 'email', 'specialization', 'licenceNumber']
    })

    // Return the first (and ideally only) assigned doctor, or null
    res.status(200).json({ doctor: doctors.length > 0 ? doctors[0] : null })
  } catch (err) {
    next(err)
  }
}

const assignDoctorToPatient = async (req, res, next) => {
  try {
    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Only patients can assign doctors' })
    }

    const { doctorId } = req.body

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' })
    }

    const doctor = await models.doctor.findByPk(doctorId)
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    // Clear existing assignment first, then assign the new doctor.
    // setDoctors() in one call fails on SQLite when patientId has a UNIQUE
    // constraint, because it tries to INSERT before it DELETEs the old row.
    await req.user.setDoctors([])
    await req.user.addDoctor(doctor)

    res.status(200).json({
      message: 'Doctor assigned successfully',
      doctor: {
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization
      }
    })
  } catch (err) {
    next(err)
  }
}

const unassignDoctor = async (req, res, next) => {
  try {
    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Only patients can unassign doctors' })
    }

    await req.user.setDoctors([])

    res.status(200).json({ message: 'Doctor unassigned successfully' })
  } catch (err) {
    next(err)
  }
}

const getMyPatients = async (req, res, next) => {
  try {
    if (req.userType !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can view their patients' })
    }

    const patients = await req.user.getPatients({
      attributes: ['id', 'firstName', 'lastName', 'email', 'dateOfBirth', 'height', 'weight', 'notes']
    })

    res.status(200).json(patients)
  } catch (err) {
    next(err)
  }
}

export default {
  getAllDoctors,
  getAssignedDoctor,
  assignDoctorToPatient,
  unassignDoctor,
  getMyPatients
}
