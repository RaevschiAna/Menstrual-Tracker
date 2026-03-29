import models from '../../models/index.mjs'

const create = async (req, res, next) => {
  try {
    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Only patients can create daily logs' })
    }

    const { logDate, cycleDay, flowLevel, mood, painLevel, symptoms, notes } = req.body

    if (!logDate || !cycleDay) {
      return res.status(400).json({ message: 'Log date and cycle day are required' })
    }

    const dailyLog = await models.daylyLog.create({
      logDate,
      cycleDay,
      flowLevel: flowLevel || null,
      mood: mood || null,
      painLevel: painLevel || null,
      symptoms: symptoms || null,
      notes: notes || null,
      patientId: req.user.id
    })

    res.status(201).json(dailyLog)
  } catch (err) {
    next(err)
  }
}

const getAll = async (req, res, next) => {
  try {
    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Only patients can view their daily logs' })
    }

    const logs = await models.daylyLog.findAll({
      where: { patientId: req.user.id },
      order: [['logDate', 'DESC']]
    })

    res.status(200).json(logs)
  } catch (err) {
    next(err)
  }
}

export default {
  create,
  getAll
}
