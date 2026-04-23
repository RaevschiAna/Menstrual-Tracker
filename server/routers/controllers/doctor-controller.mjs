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

const assignDoctorToPatient = async (req, res, next) => {
  try {
    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Only patients can assign doctors' })
    }

    const { doctorId } = req.body
    const patientId = req.user.id

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' })
    }

    // Check if doctor exists
    const doctor = await models.doctor.findByPk(doctorId)
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    // Add doctor to patient
    await req.user.addDoctor(doctor)

    res.status(200).json({ 
      message: 'Doctor assigned successfully',
      doctor: {
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email
      }
    })
  } catch (err) {
    next(err)
  }
}

export default {
  getAllDoctors,
  assignDoctorToPatient
}
