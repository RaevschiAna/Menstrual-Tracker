import './Dashboard.css'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PatientDashboard from './PatientDashboard/PatientDashboard'

// selectors
const userTypeSelector = state => state.user.data.type

const Dashboard = () => {
  const userType = useSelector(userTypeSelector)

  return (
    <div className='dashboard'>
      <h1>Welcome to your Home Page</h1>
      <PatientDashboard/>

      {userType === 'admin' && (
        <div>
          <Link to='/users'>Users                                </Link>
          <Link to='/projects'>                                   Projects</Link>
        </div>
      )}

      {userType === 'regular' && (
        <div>
          <Link to='/projects'>Projects</Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
