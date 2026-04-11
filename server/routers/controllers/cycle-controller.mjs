import models from '../../models/index.mjs'

// Get the user's cycle history/medical form
const getCycleHistory = async (req, res, next) => {
  try {
    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Only patients can view their cycle history' })
    }

    const cycleHistory = await models.cycle.findOne({
      where: { patientId: req.user.id }
    })

    if (!cycleHistory) {
      // Return empty response instead of 404 so form can be created
      return res.status(200).json({})
    }

    res.status(200).json(cycleHistory)
  } catch (err) {
    next(err)
  }
}

// Create or update the user's cycle history/medical form
const upsertCycleHistory = async (req, res, next) => {
  try {
    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Only patients can update their cycle history' })
    }

    const {
      ageAtFirstPeriod,
      cycleLength,
      periodDuration,
      usualFlowLevel,
      conditionsPMDD,
      conditionsPMS,
      conditionsEndometriosis,
      conditionsPCOS,
      conditionsFibroid,
      otherConditions,
      medications,
      notes
    } = req.body

    // Find existing cycle history
    let cycleHistory = await models.cycle.findOne({
      where: { patientId: req.user.id }
    })

    if (cycleHistory) {
      // Update existing record
      cycleHistory = await cycleHistory.update({
        ageAtFirstPeriod: ageAtFirstPeriod || cycleHistory.ageAtFirstPeriod,
        cycleLength: cycleLength || cycleHistory.cycleLength,
        periodDuration: periodDuration || cycleHistory.periodDuration,
        usualFlowLevel: usualFlowLevel || cycleHistory.usualFlowLevel,
        conditionsPMDD: conditionsPMDD !== undefined ? conditionsPMDD : cycleHistory.conditionsPMDD,
        conditionsPMS: conditionsPMS !== undefined ? conditionsPMS : cycleHistory.conditionsPMS,
        conditionsEndometriosis: conditionsEndometriosis !== undefined ? conditionsEndometriosis : cycleHistory.conditionsEndometriosis,
        conditionsPCOS: conditionsPCOS !== undefined ? conditionsPCOS : cycleHistory.conditionsPCOS,
        conditionsFibroid: conditionsFibroid !== undefined ? conditionsFibroid : cycleHistory.conditionsFibroid,
        otherConditions: otherConditions || cycleHistory.otherConditions,
        medications: medications || cycleHistory.medications,
        notes: notes || cycleHistory.notes
      })

      res.status(200).json(cycleHistory)
    } else {
      // Create new record
      cycleHistory = await models.cycle.create({
        ageAtFirstPeriod,
        cycleLength,
        periodDuration,
        usualFlowLevel,
        conditionsPMDD,
        conditionsPMS,
        conditionsEndometriosis,
        conditionsPCOS,
        conditionsFibroid,
        otherConditions,
        medications,
        notes,
        patientId: req.user.id
      })

      res.status(201).json(cycleHistory)
    }
  } catch (err) {
    next(err)
  }
}

export default {
  getCycleHistory,
  upsertCycleHistory
}
