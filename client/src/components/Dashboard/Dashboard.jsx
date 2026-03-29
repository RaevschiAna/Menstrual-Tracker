import './Dashboard.css'
import React from 'react'
import { useSelector } from 'react-redux'
import Sidebar from '../Sidebar/Sidebar'
import PatientDashboard from './PatientDashboard/PatientDashboard'
import DoctorDashboard from './DoctorDashboard/DoctorDashboard'

// selectors
const userTypeSelector = state => state.user.data.type

const Dashboard = () => {
  const userType = useSelector(userTypeSelector)

  return (
    <Sidebar userType={userType}>
      <div className='dashboard-content'>
        {userType === 'patient' && <PatientDashboard />}
        {userType === 'doctor' && <DoctorDashboard />}
      </div>
    </Sidebar>
  )
}

export default Dashboard
