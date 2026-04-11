import './PatientDashboard.css'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Calendar from '../../Calendar'

const userSelector = state => state.user.data

const PatientDashboard = () => {
  const user = useSelector(userSelector)
  const navigate = useNavigate()
  const [notifications] = useState([])

  return (
    <div className='patient-dashboard'>
      {/* Header */}
      <div className='pd-header'>
        <h1 className='pd-welcome'>Welcome, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'Patient'}!</h1>
        <div className='pd-header-right'>
          <div className='pd-period-badge'>
            <span className='pd-period-label'>Next Predicted Period</span>
            <span className='pd-period-date'>—</span>
          </div>
          <button className='pd-bell'>🔔</button>
        </div>
      </div>

      {/* Calendar */}
      <div className='pd-calendar-section'>
        <Calendar />
      </div>

      {/* Add Daily Log */}
      <div className='pd-action'>
        <button className='pd-btn-log' onClick={() => navigate('/daily-log/new')}>Add Daily Log</button>
      </div>

      {/* Notifications */}
      <div className='pd-notifications'>
        <h3>Notifications</h3>
        {notifications.length === 0 && (
          <p className='pd-empty'>No notifications yet.</p>
        )}
        {notifications.map(n => (
          <div key={n.id} className='pd-notif-item'>
            <input type='checkbox' />
            <div className='pd-notif-body'>
              <p className='pd-notif-text'><strong>{n.doctor}</strong> {n.message}</p>
              <span className='pd-notif-time'>{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PatientDashboard