const MS_PER_DAY = 1000 * 60 * 60 * 24
const DEFAULT_CYCLE_LENGTH      = 28
const DEFAULT_PERIOD_DURATION   = 5
const PREDICTION_HORIZON_YEARS  = 5   // generate predictions this many years into the future

/**
 * Groups an array of Date objects (already sorted ascending) into period
 * clusters. Two dates belong to the same period if they are ≤ gapDays apart.
 */
function groupIntoPeriods(dates, gapDays = 2) {
  const periods = []
  let current = null

  for (const d of dates) {
    if (!current) {
      current = { start: d, end: d }
    } else {
      const gap = Math.round((d - current.end) / MS_PER_DAY)
      if (gap <= gapDays) {
        current.end = d
      } else {
        periods.push(current)
        current = { start: d, end: d }
      }
    }
  }
  if (current) periods.push(current)
  return periods
}

/**
 * Core prediction function.
 *
 * @param {Array}  logs         - raw daily log objects from the Redux store
 * @param {Object} cycleHistory - cycle history object from the Redux store (may be empty {})
 * @returns {{ nextPeriodStart: Date|null, predictedDays: Date[], confidence: 'high'|'medium'|'low', basedOn: string }}
 */
export function predictNextPeriod(logs = [], cycleHistory = {}) {
  // 1. Extract period days from logs
  const flowDates = (logs || [])
    .filter(l => l.flowLevel && l.flowLevel.trim() !== '')
    .map(l => new Date(l.logDate))
    .sort((a, b) => a - b)

  const detectedPeriods = groupIntoPeriods(flowDates)

  let avgCycleLength  = cycleHistory.cycleLength  || DEFAULT_CYCLE_LENGTH
  let avgPeriodDuration = cycleHistory.periodDuration || DEFAULT_PERIOD_DURATION
  let lastPeriodStart = null
  let confidence = 'low'
  let basedOn = 'defaults'

  if (detectedPeriods.length >= 1) {
    // cycleLength and periodDuration always come from cycle history (never
    // recalculated from logs — the patient's profile values are authoritative).
    // Logs only determine the anchor date (lastPeriodStart) and confidence level.
    lastPeriodStart = detectedPeriods[detectedPeriods.length - 1].start
    confidence = detectedPeriods.length >= 3 ? 'high'
               : detectedPeriods.length === 2 ? 'medium'
               : 'medium'
    basedOn = detectedPeriods.length === 1
      ? '1 logged cycle + profile data'
      : `${detectedPeriods.length} logged cycles`

  } else if (cycleHistory.periodStart) {
    // Only one period in logs — use it as anchor, rely on history for length
    lastPeriodStart = detectedPeriods[0].start
    confidence = 'medium'
    basedOn = '1 logged cycle + profile data'

  } else if (cycleHistory.periodStart) {
    // No flow logs at all — use manually entered cycle history
    lastPeriodStart = new Date(cycleHistory.periodStart)
    confidence = 'medium'
    basedOn = 'profile data'
  }

  if (!lastPeriodStart) {
    return { nextPeriodStart: null, predictedDays: [], confidence: 'low', basedOn: 'no data' }
  }

  // 2. Project forward
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastStart = new Date(lastPeriodStart)
  lastStart.setHours(0, 0, 0, 0)

  // How far ahead to pre-generate predictions
  const horizon = new Date(today.getTime() + PREDICTION_HORIZON_YEARS * 365.25 * MS_PER_DAY)

  const predictedDays = []

  // If today falls within the last detected/logged period window, the patient is
  // actively logging their current period. Show the remaining unlogged days of
  // that window as predicted so they don't disappear from the calendar.
  const currentPeriodEndTime = lastStart.getTime() + avgPeriodDuration * MS_PER_DAY
  const isInCurrentPeriod = lastStart.getTime() <= today.getTime() &&
                             today.getTime() < currentPeriodEndTime

  if (isInCurrentPeriod) {
    for (let t = today.getTime() + MS_PER_DAY; t < currentPeriodEndTime; t += MS_PER_DAY) {
      predictedDays.push(new Date(t))
    }
  }

  // Compute the start of the next full predicted cycle:
  // advance by one avgCycleLength at a time from lastStart until we land after today.
  let nextStart = new Date(lastStart.getTime() + avgCycleLength * MS_PER_DAY)
  while (nextStart <= today) {
    nextStart = new Date(nextStart.getTime() + avgCycleLength * MS_PER_DAY)
  }

  // 3. Generate all predicted periods from nextStart up to the horizon.
  //    Each period window = avgPeriodDuration days; windows are avgCycleLength apart.
  //    When a logged period deviates from a prediction, lastStart (= last logged
  //    period) shifts, so nextStart and every subsequent window shift accordingly.
  let cycleStart = new Date(nextStart)
  while (cycleStart <= horizon) {
    for (let i = 0; i < avgPeriodDuration; i++) {
      const d = new Date(cycleStart)
      d.setDate(d.getDate() + i)
      predictedDays.push(d)
    }
    cycleStart = new Date(cycleStart.getTime() + avgCycleLength * MS_PER_DAY)
  }

  return { nextPeriodStart: nextStart, predictedDays, confidence, basedOn }
}
