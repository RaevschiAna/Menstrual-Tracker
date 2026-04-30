import './PatientClinicalNotes.css'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Sidebar from '../Sidebar/Sidebar'
import { SERVER } from '../../config/global'

const tokenSelector   = state => state.user.data.token
const userTypeSelector = state => state.user.data.type

const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const PatientClinicalNotes = ({ onLogout }) => {
  const token    = useSelector(tokenSelector)
  const userType = useSelector(userTypeSelector)

  const [notes, setNotes]     = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${SERVER}/api/clinical-notes`, {
          headers: { 'Content-Type': 'application/json', Authorization: token }
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || 'Failed to fetch notes')
        }
        setNotes(await res.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [token])

  return (
    <Sidebar userType={userType} onLogout={onLogout}>
      <div className='pcn-container'>
        <div className='pcn-header'>
          <h2>Clinical Notes</h2>
          <p className='pcn-subtitle'>Notes written by your doctor</p>
        </div>

        <div className='pcn-body'>
          {loading && <p className='pcn-state'>Loading…</p>}
          {error   && <p className='pcn-state pcn-error'>Error: {error}</p>}

          {!loading && !error && notes.length === 0 && (
            <div className='pcn-empty'>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
                <path d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/>
              </svg>
              <p>No clinical notes yet.</p>
              <span>Your doctor hasn't added any notes for you.</span>
            </div>
          )}

          {!loading && !error && notes.length > 0 && (
            <div className='pcn-list'>
              {notes.map(note => {
                const doc = note.doctor
                return (
                  <div key={note.id} className='pcn-note-card'>
                    <div className='pcn-note-meta'>
                      <div className='pcn-doctor-badge'>
                        {doc
                          ? `Dr. ${doc.firstName} ${doc.lastName}`
                          : 'Doctor'}
                      </div>
                      {doc?.specialization && (
                        <span className='pcn-specialization'>{doc.specialization}</span>
                      )}
                      <span className='pcn-date'>{formatDate(note.createdAt)}</span>
                    </div>
                    <p className='pcn-note-text'>{note.notes}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  )
}

export default PatientClinicalNotes
