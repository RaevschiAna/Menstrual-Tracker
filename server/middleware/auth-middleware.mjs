import models from '../models/index.mjs'

export default async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = req.headers.authorization

    // Check patient first, then doctor
    let user = await models.patient.findOne({
      where: { token }
    })
    if (user) {
      req.user = user
      req.userType = 'patient'
      return next()
    }

    user = await models.doctor.findOne({
      where: { token }
    })
    if (user) {
      req.user = user
      req.userType = 'doctor'
      return next()
    }

    return res.status(401).json({ message: 'Unauthorized' })
  } catch (err) {
    next(err)
  }
}