import './PatientDashboard.css'
import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Calendar from '../../Calendar'
import { getCycleHistory } from '../../../stores/actions/cycle-actions'
import { getDailyLogs } from '../../../stores/actions/daily-log-actions'
import { predictNextPeriod } from '../../../utils/cyclePredictor'

const userSelector        = state => state.user.data
const logsSelector        = state => state.dailyLog.data
const cycleHistorySelector = state => state.cycle.data

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatDate = (date) => {
  if (!date) return '—'
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

const confidenceLabel = (confidence, basedOn) => {
  if (confidence === 'high')   return `Based on ${basedOn}`
  if (confidence === 'medium') return `Estimated · ${basedOn}`
  return 'Not enough data yet'
}

const PatientDashboard = () => {
  const dispatch    = useDispatch()
  const user        = useSelector(userSelector)
  const logs        = useSelector(logsSelector)
  const cycleHistory = useSelector(cycleHistorySelector)
  const navigate    = useNavigate()

  useEffect(() => {
    const load = async () => {
      dispatch(await getDailyLogs())
      dispatch(await getCycleHistory())
    }
    load()
  }, [dispatch])

  const prediction = useMemo(
    () => predictNextPeriod(logs, cycleHistory),
    [logs, cycleHistory]
  )

  return (
    <div className='patient-dashboard'>
      {/* Header */}
      <div className='pd-header'>
        <div className='pd-welcome-row'>
          <div className='pd-avatar'>
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'P'}
          </div>
          <h1 className='pd-welcome'>Welcome, {user?.firstName || 'Patient'}!</h1>
        </div>
        <div className='pd-header-right'>
          <div className='pd-period-badge'>
            <span className='pd-period-label'>Next Predicted Period</span>
            <span className='pd-period-date'>{formatDate(prediction.nextPeriodStart)}</span>
            <span className='pd-period-confidence'>{confidenceLabel(prediction.confidence, prediction.basedOn)}</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className='pd-calendar-section'>
        <Calendar predictedDays={prediction.predictedDays} />
      </div>

      {/* Log Period */}
      <div className='pd-action'>
        <button className='pd-btn-log' onClick={() => navigate('/daily-log/new')}>Log Period</button>
      </div>

      {/* Notifications */}
      <div className='pd-notifications'>
        <h3>Notifications</h3>
        <p className='pd-empty'>No notifications yet.</p>
      </div>
    </div>
  )
}

export default PatientDashboard
