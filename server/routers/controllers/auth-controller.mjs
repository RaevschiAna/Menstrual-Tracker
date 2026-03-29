import bcrypt from 'bcrypt'
import models from '../../models/index.mjs'
import jwt from 'jsonwebtoken'

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !email.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Try patient first
    let user = await models.patient.findOne({
      where: {
        email: email.trim()
      }
    })
    let userType = 'patient'

    // If not found, try doctor
    if (!user) {
      user = await models.doctor.findOne({
        where: {
          email: email.trim()
        }
      })
      userType = 'doctor'
    }

    if (user) {
      const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash)
      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        user.token = token
        await user.save()
        res.status(200).json({ token, email: user.email, id: user.id, type: userType })
      } else {
        res.status(401).json({ message: 'Invalid email or password' })
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    // Try patient first
    let user = await models.patient.findOne({
      where: {
        token: req.body.token
      }
    })

    // If not found, try doctor
    if (!user) {
      user = await models.doctor.findOne({
        where: {
          token: req.body.token
        }
      })
    }

    if (user) {
      user.token = null
      await user.save()
      res.status(200).json({ message: 'User logged out' })
    } else {
      res.status(401).json({ message: 'Invalid token' })
    }
  } catch (err) {
    next(err)
  }
}

const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, height, weight } = req.body

    if (!email || !email.trim() || !password || !firstName || !lastName || !dateOfBirth || !height || !weight) {
      return res.status(400).json({ message: 'All fields are required for registration' })
    }

    const existingUser = await models.patient.findOne({
      where: {
        email: email.trim()
      }
    })

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const user = await models.patient.create({
      email: email.trim(),
      passwordHash: await bcrypt.hash(password, 10),
      firstName,
      lastName,
      dateOfBirth,
      height,
      weight
    })
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

export default {
  login,
  logout,
  register
}
