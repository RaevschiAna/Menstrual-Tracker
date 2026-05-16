import models from '../../models/index.mjs'

const getProfile = async (req, res, next) => {
  try {
    const user = req.user
    const userType = req.userType

    const profile = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture || null,
      type: userType
    }

    if (userType === 'patient') {
      profile.height = user.height
      profile.weight = user.weight
    }

    res.status(200).json(profile)
  } catch (err) {
    next(err)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const user = req.user
    const userType = req.userType
    const { firstName, lastName, height, weight } = req.body

    const updates = {}

    if (firstName && firstName.trim()) updates.firstName = firstName.trim()
    if (lastName && lastName.trim()) updates.lastName = lastName.trim()

    if (userType === 'patient') {
      const h = Number(height)
      const w = Number(weight)
      if (!isNaN(h) && h > 0) updates.height = h
      if (!isNaN(w) && w > 0) updates.weight = w
    }

    await user.update(updates)

    const profile = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture || null,
      type: userType
    }

    if (userType === 'patient') {
      profile.height = user.height
      profile.weight = user.weight
    }

    res.status(200).json(profile)
  } catch (err) {
    next(err)
  }
}

const uploadPicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const user = req.user
    const filename = req.file.filename

    await user.update({ profilePicture: filename })

    res.status(200).json({ profilePicture: filename })
  } catch (err) {
    next(err)
  }
}

export default {
  getProfile,
  updateProfile,
  uploadPicture
}
