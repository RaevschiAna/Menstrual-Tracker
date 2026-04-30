import './PatientDashboard.css'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Calendar from '../../Calendar'
import { getCycleHistory } from '../../../stores/actions/cycle-actions'
import { getDailyLogs } from '../../../stores/actions/daily-log-actions'
import { predictNextPeriod } from '../../../utils/cyclePredictor'
import { SERVER } from '../../../config/global'

const userSelector         = state => state.user.data
const logsSelector         = state => state.dailyLog.data
const cycleHistorySelector = state => state.cycle.data
const tokenSelector        = state => state.user.data.token

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

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const formatNoteDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

const PatientDashboard = () => {
  const dispatch     = useDispatch()
  const user         = useSelector(userSelector)
  const logs         = useSelector(logsSelector)
  const cycleHistory = useSelector(cycleHistorySelector)
  const token        = useSelector(tokenSelector)
  const navigate     = useNavigate()

  const [unreadNotes, setUnreadNotes] = useState([])

  useEffect(() => {
    const load = async () => {
      dispatch(await getDailyLogs())
      dispatch(await getCycleHistory())
    }
    load()
  }, [dispatch])

  useEffect(() => {
    if (!token) return
    const fetchUnread = async () => {
      try {
        const res = await fetch(`${SERVER}/api/clinical-notes`, {
          headers: { Authorization: token }
        })
        if (res.ok) {
          const all = await res.json()
          setUnreadNotes(all.filter(n => !n.isRead))
        }
      } catch { /* silent */ }
    }
    fetchUnread()
  }, [token])

  const handleMarkRead = useCallback(async (noteId) => {
    try {
      const res = await fetch(`${SERVER}/api/clinical-notes/${noteId}/read`, {
        method: 'PATCH',
        headers: { Authorization: token }
      })
      if (res.ok) {
        setUnreadNotes(prev => prev.filter(n => n.id !== noteId))
      }
    } catch { /* silent */ }
  }, [token])

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
        <div className='pd-notif-header'>
          <h3>Notifications</h3>
          {unreadNotes.length > 0 && (
            <span className='pd-notif-badge'>{unreadNotes.length}</span>
          )}
        </div>

        {unreadNotes.length === 0 ? (
          <p className='pd-empty'>No new notifications.</p>
        ) : (
          unreadNotes.map(note => (
            <div key={note.id} className='pd-notif-item'>
              <input
                type='checkbox'
                title='Mark as read'
                onChange={() => handleMarkRead(note.id)}
              />
              <div className='pd-notif-body'>
                <div>
                  <p className='pd-notif-label'>
                    New clinical note
                    {note.doctor && ` from Dr. ${note.doctor.firstName} ${note.doctor.lastName}`}
                  </p>
                  <p className='pd-notif-text'>{note.notes}</p>
                </div>
                <span className='pd-notif-time'>{formatNoteDate(note.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PatientDashboard
