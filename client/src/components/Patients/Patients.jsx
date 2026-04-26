import './Patients.css'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { SERVER } from '../../config/global'

const userTypeSelector  = state => state.user.data.type
const tokenSelector     = state => state.user.data.token

const Patients = () => {
  const userType = useSelector(userTypeSelector)
  const token    = useSelector(tokenSelector)

  const [patients, setPatients] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    if (userType !== 'doctor') return

    const fetchPatients = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${SERVER}/api/patients`, {
          headers: { 'Content-Type': 'application/json', Authorization: token }
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || 'Failed to fetch patients')
        }
        setPatients(await res.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [userType, token])

  if (userType !== 'doctor') {
    return <div className='patients-container'><p className='patients-empty'>Access denied.</p></div>
  }

  const filtered = patients.filter(p => {
    const q = search.toLowerCase()
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    )
  })

  const calcAge = (dob) => {
    if (!dob) return null
    const diff = Date.now() - new Date(dob).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  return (
    <div className='patients-container'>
      <div className='patients-header'>
        <h2>My Patients</h2>
        <input
          type='text'
          placeholder='Search by name or email…'
          className='patients-search'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className='patients-loading'>Loading…</p>}
      {error   && <p className='patients-error'>Error: {error}</p>}

      {!loading && !error && (
        <>
          <p className='patients-count'>
            {filtered.length === 0
              ? 'No patients found'
              : `${filtered.length} patient${filtered.length !== 1 ? 's' : ''}`}
          </p>

          <div className='patients-list'>
            {filtered.map(patient => {
              const age = calcAge(patient.dateOfBirth)
              return (
                <div key={patient.id} className='patient-card'>
                  <div className='patient-avatar'>
                    <span className='avatar-initials'>
                      {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                    </span>
                  </div>

                  <div className='patient-info'>
                    <h3 className='patient-name'>
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className='patient-email'>{patient.email}</p>

                    <div className='patient-meta'>
                      {age !== null && (
                        <span className='meta-chip'>{age} yrs</span>
                      )}
                      {patient.height && (
                        <span className='meta-chip'>{patient.height} cm</span>
                      )}
                      {patient.weight && (
                        <span className='meta-chip'>{patient.weight} kg</span>
                      )}
                    </div>

                    {patient.notes && (
                      <p className='patient-notes'>{patient.notes}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default Patients
