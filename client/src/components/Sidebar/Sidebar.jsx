import React, { useState } from 'react'
import './Sidebar.css'
import { useNavigate, useLocation } from 'react-router-dom'

const icons = {
  dashboard: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='3' y='3' width='7' height='7' rx='1'/><rect x='14' y='3' width='7' height='4' rx='1'/><rect x='3' y='14' width='7' height='7' rx='1'/><rect x='14' y='11' width='7' height='10' rx='1'/>
    </svg>
  ),
  dailyLog: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/>
    </svg>
  ),
  cycleHistory: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M12 2L2 7l10 5 10-5-10-5z'/><path d='M2 17l10 5 10-5'/><path d='M2 12l10 5 10-5'/>
    </svg>
  ),
  predictions: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <polyline points='22 12 18 12 15 21 9 3 6 12 2 12'/>
    </svg>
  ),
  patients: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/>
    </svg>
  ),
  reports: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/>
    </svg>
  ),
  doctors: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M11 23H1v-7a6 6 0 0 1 6-6 6 6 0 0 1 6 6v7'/>
      <path d='M7 16a4 4 0 0 0 4 4 4 4 0 0 0 4-4'/>
      <circle cx='15' cy='7' r='4'/>
      <path d='M22 16c0-1.1.9-2 2-2s2 .9 2 2-1.9 3-2 3-2-1.9-2-3z'/>
    </svg>
  )
}

const Sidebar = ({ userType, children, onLogout }) => {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const getMenuItems = () => {
    if (userType === 'patient') {
      return [
        { icon: icons.dashboard, text: 'Dashboard', path: '/' },
        { icon: icons.dailyLog, text: 'Daily Log', path: '/daily-log' },
        { icon: icons.cycleHistory, text: 'Cycle History', path: '/cycle-history' },
        { icon: icons.doctors, text: 'Doctors', path: '/doctors' },
        { icon: icons.predictions, text: 'Predictions', path: '/predictions' }
      ]
    } else if (userType === 'doctor') {
      return [
        { icon: icons.dashboard, text: 'Dashboard', path: '/' },
        { icon: icons.patients, text: 'Patients', path: '/patients' },
        { icon: icons.reports, text: 'Reports', path: '/reports' },
        { icon: icons.predictions, text: 'Predictions', path: '/predictions' }
      ]
    }
    return []
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === ''
    return location.pathname.startsWith(path)
  }

  const handleMenuClick = (path) => {
    navigate(path)
  }

  return (
    <div className="layout">
      <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          <svg className="sidebar-logo" viewBox='0 0 24 24'>
            <defs>
              <linearGradient id='tearDropGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                <stop offset='0%' style={{ stopColor: '#E8938F', stopOpacity: 1 }} />
                <stop offset='100%' style={{ stopColor: '#D4605E', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path d='M12 2C12 2 18 8 18 14C18 19.52 15.31 22 12 22C8.69 22 6 19.52 6 14C6 8 12 2 12 2Z' fill='url(#tearDropGradient)'/>
          </svg>
          <span className="sidebar-title">Menstrual<br/>Tracker</span>
        </div>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isOpen ? '✕' : '☰'}
        </button>
        
        <ul className="menu-list">
          {getMenuItems().map((item, index) => (
            <li key={index} className={`menu-item ${isActive(item.path) ? 'active' : ''}`} onClick={() => handleMenuClick(item.path)}>
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.text}</span>
            </li>
          ))}
        </ul>
        {onLogout && (
          <button className="logout-button" onClick={onLogout}>
            <span className="menu-icon">
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/>
              </svg>
            </span>
            <span className="menu-text">Logout</span>
          </button>
        )}
      </div>

      <div className="main-content">
        {children}
      </div>
    </div>
  )
}

export default Sidebar
