import './Doctors.css'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getAllDoctors,
  getAssignedDoctor,
  assignDoctorToPatient,
  unassignDoctor
} from '../../stores/actions/doctor-actions'

const userTypeSelector = state => state.user.data.type
const doctorsSelector  = state => state.doctor.data
const loadingSelector  = state => state.doctor.loading
const errorSelector    = state => state.doctor.error
const assignedSelector = state => state.doctor.assigned  // null | doctor object

const Doctors = () => {
  const dispatch  = useDispatch()
  const userType  = useSelector(userTypeSelector)
  const doctors   = useSelector(doctorsSelector)
  const loading   = useSelector(loadingSelector)
  const error     = useSelector(errorSelector)
  const assigned  = useSelector(assignedSelector)

  const [message, setMessage]       = useState('')
  const [messageType, setMessageType] = useState('')
  const [search, setSearch]         = useState('')
  const [pendingId, setPendingId]   = useState(null)  // doctor awaiting confirmation to switch

  useEffect(() => {
    const load = async () => {
      try {
        dispatch(await getAllDoctors())
        dispatch(await getAssignedDoctor())
      } catch (err) {
        showMessage(err.message, 'error')
      }
    }
    load()
  }, [dispatch])

  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSelect = async (doctor) => {
    // Already assigned — clicking again prompts unassign
    if (assigned && assigned.id === doctor.id) {
      try {
        dispatch(await unassignDoctor())
        showMessage('Doctor removed from your profile.', 'info')
      } catch (err) {
        showMessage(err.message, 'error')
      }
      setPendingId(null)
      return
    }

    // A different doctor is already assigned — ask for confirmation first
    if (assigned && assigned.id !== doctor.id) {
      if (pendingId === doctor.id) {
        // User confirmed the switch
        try {
          dispatch(await assignDoctorToPatient(doctor.id))
          showMessage(`Dr. ${doctor.lastName} is now your doctor.`, 'success')
        } catch (err) {
          showMessage(err.message, 'error')
        }
        setPendingId(null)
      } else {
        // Show inline confirmation
        setPendingId(doctor.id)
      }
      return
    }

    // No doctor assigned yet — just select
    try {
      dispatch(await assignDoctorToPatient(doctor.id))
      showMessage(`Dr. ${doctor.lastName} selected as your doctor.`, 'success')
    } catch (err) {
      showMessage(err.message, 'error')
    }
    setPendingId(null)
  }

  const cancelSwitch = () => setPendingId(null)

  const filteredDoctors = (doctors || []).filter(d => {
    const q = search.toLowerCase()
    return (
      d.firstName.toLowerCase().includes(q) ||
      d.lastName.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q)
    )
  })

  if (userType !== 'patient') {
    return <div className='doctors-container'><p className='doctors-empty'>Access denied.</p></div>
  }

  return (
    <div className='doctors-container'>
      <div className='doctors-header'>
        <h2>Find a Doctor</h2>
        <input
          type='text'
          placeholder='Search by name or specialty…'
          className='doctors-search'
          value={search}
          onChange={e => { setSearch(e.target.value); setPendingId(null) }}
        />
      </div>

      {message && <div className={`doctors-message ${messageType}`}>{message}</div>}

      {assigned && (
        <div className='doctors-current-banner'>
          <div className='current-avatar'>
            <span>{assigned.firstName.charAt(0)}{assigned.lastName.charAt(0)}</span>
          </div>
          <div className='current-info'>
            <p className='current-label'>Your current doctor</p>
            <p className='current-name'>Dr. {assigned.lastName}</p>
            <p className='current-specialty'>{assigned.specialization}</p>
          </div>
          <button
            className='current-remove-btn'
            onClick={async () => {
              try {
                dispatch(await unassignDoctor())
                showMessage('Doctor removed from your profile.', 'info')
                setPendingId(null)
              } catch (err) {
                showMessage(err.message, 'error')
              }
            }}
            title='Remove doctor'
          >
            ✕
          </button>
        </div>
      )}

      {loading && <p className='doctors-loading'>Loading…</p>}
      {error   && <p className='doctors-error'>Error: {error}</p>}

      <div className='doctors-list'>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => {
            const isAssigned = assigned && assigned.id === doctor.id
            const isPending  = pendingId === doctor.id

            return (
              <div
                key={doctor.id}
                className={`doctor-item ${isAssigned ? 'assigned' : ''} ${isPending ? 'pending' : ''}`}
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
                  {isPending ? (
                    <div className='switch-confirm'>
                      <span className='switch-label'>Switch?</span>
                      <button className='confirm-btn' onClick={() => handleSelect(doctor)}>Yes</button>
                      <button className='cancel-btn'  onClick={cancelSwitch}>No</button>
                    </div>
                  ) : (
                    <button
                      className={`doctor-select-btn ${isAssigned ? 'selected' : ''}`}
                      onClick={() => handleSelect(doctor)}
                      title={isAssigned ? 'Remove doctor' : assigned ? 'Switch to this doctor' : 'Select this doctor'}
                    >
                      {isAssigned ? '✓' : '+'}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          !loading && <p className='doctors-empty'>No doctors found</p>
        )}
      </div>
    </div>
  )
}

export default Doctors
