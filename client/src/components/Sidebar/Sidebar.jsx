import React, { useState } from 'react'
import './Sidebar.css'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ userType, children }) => {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const getMenuItems = () => {
    if (userType === 'patient') {
      return [
        { icon: '📊', text: 'Dashboard', path: '/' },
        { icon: '�', text: 'Daily Log', path: '/daily-log' },
        { icon: '�', text: 'Cycle History', path: '/cycle-history' },
        { icon: '🔮', text: 'Predictions', path: '/predictions' }
      ]
    } else if (userType === 'doctor') {
      return [
        { icon: '📊', text: 'Dashboard', path: '/' },
        { icon: '👥', text: 'Patients', path: '/patients' },
        { icon: '📋', text: 'Reports', path: '/reports' },
        { icon: '🔮', text: 'Predictions', path: '/predictions' }
      ]
    }
    return []
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
            <li key={index} className="menu-item" onClick={() => handleMenuClick(item.path)}>
              <span className="menu-icon" role="img" aria-label={item.text}>{item.icon}</span>
              <span className="menu-text">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        {children}
      </div>
    </div>
  )
}

export default Sidebar
