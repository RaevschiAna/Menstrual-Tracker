import './Doctors.css'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllDoctors, assignDoctorToPatient } from '../../stores/actions/doctor-actions'

const userTypeSelector = state => state.user.data.type
const doctorsSelector = state => state.doctor.data
const loadingSelector = state => state.doctor.loading
const errorSelector = state => state.doctor.error
const assignedSelector = state => state.doctor.assigned

const Doctors = () => {
  const dispatch = useDispatch()
  const userType = useSelector(userTypeSelector)
  const doctors = useSelector(doctorsSelector)
  const loading = useSelector(loadingSelector)
  const error = useSelector(errorSelector)
  const assigned = useSelector(assignedSelector)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const action = await getAllDoctors()
        dispatch(action)
      } catch (err) {
        setMessage(err.message)
        setMessageType('error')
      }
    }
    fetchDoctors()
  }, [dispatch])

  const handleAssignDoctor = async (doctorId) => {
    try {
      const action = await assignDoctorToPatient(doctorId)
      dispatch(action)
      setMessage('Doctor assigned successfully!')
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.message)
      setMessageType('error')
    }
  }

  const isDoctorAssigned = (doctorId) => {
    return assigned.some(doc => doc.id === doctorId)
  }

  if (userType !== 'patient') {
    return <div className='doctors-container'><p>Access denied</p></div>
  }

  return (
    <div className='doctors-container'>
      <div className='doctors-header'>
        <h2>Medicine Meet</h2>
        <input type='text' placeholder='Search for doctor' className='doctors-search' />
      </div>
      
      {message && <div className={`doctors-message ${messageType}`}>{message}</div>}
      
      {loading && <p className='doctors-loading'>Loading doctors...</p>}
      
      {error && <p className='doctors-error'>Error: {error}</p>}
      
      <div className='doctors-list'>
        {doctors && doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className={`doctor-item ${isDoctorAssigned(doctor.id) ? 'assigned' : ''}`}
              onClick={() => handleAssignDoctor(doctor.id)}
            >
              <div className='doctor-avatar'>
                <span className='avatar-initials'>
                  {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                </span>
              </div>
              
              <div className='doctor-content'>
                <h3 className='doctor-name'>Dr. {doctor.lastName}</h3>
                <p className='doctor-specialty'>{doctor.specialization}</p>
              </div>
              
              <div className='doctor-action'>
                <button 
                  className={`doctor-select-btn ${isDoctorAssigned(doctor.id) ? 'selected' : ''}`}
                  disabled={isDoctorAssigned(doctor.id)}
                >
                  {isDoctorAssigned(doctor.id) ? '✓' : '+'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className='doctors-empty'>No doctors available</p>
        )}
      </div>
    </div>
  )
}

export default Doctors
