import './Patients.css'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { SERVER } from '../../config/global'

const userTypeSelector = state => state.user.data.type
const tokenSelector    = state => state.user.data.token

const FLOW_LABEL = { heavy: 'Heavy', medium: 'Medium', light: 'Light' }

const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const calcAge = (dob) => {
  if (!dob) return null
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

// ── Report Modal ────────────────────────────────────────────────────────────
const ReportModal = ({ patient, reportData, onClose }) => {
  const { logs, cycleHistory } = reportData

  const conditions = []
  if (cycleHistory.conditionsPMDD)          conditions.push('PMDD')
  if (cycleHistory.conditionsPMS)           conditions.push('PMS')
  if (cycleHistory.conditionsEndometriosis) conditions.push('Endometriosis')
  if (cycleHistory.conditionsPCOS)          conditions.push('PCOS')
  if (cycleHistory.conditionsFibroid)       conditions.push('Uterine Fibroid')

  return (
    <div className='report-modal-overlay' onClick={onClose}>
      <div className='report-modal' onClick={e => e.stopPropagation()}>

        <div className='report-modal-header'>
          <div className='report-modal-title'>
            <div className='report-patient-avatar'>
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <div>
              <h2>{patient.firstName} {patient.lastName}</h2>
              <p className='report-patient-email'>{patient.email}</p>
            </div>
          </div>
          <button className='report-close-btn' onClick={onClose}>✕</button>
        </div>

        <div className='report-modal-body'>

          {/* Cycle Profile */}
          <div className='report-section'>
            <h3 className='report-section-title'>Cycle Profile</h3>
            {Object.keys(cycleHistory).length === 0 ? (
              <p className='report-empty'>No cycle history recorded.</p>
            ) : (
              <div className='report-profile-grid'>
                {cycleHistory.cycleLength && (
                  <div className='report-profile-item'>
                    <span className='rp-label'>Cycle length</span>
                    <span className='rp-value'>{cycleHistory.cycleLength} days</span>
                  </div>
                )}
                {cycleHistory.periodDuration && (
                  <div className='report-profile-item'>
                    <span className='rp-label'>Period duration</span>
                    <span className='rp-value'>{cycleHistory.periodDuration} days</span>
                  </div>
                )}
                {cycleHistory.usualFlowLevel && (
                  <div className='report-profile-item'>
                    <span className='rp-label'>Usual flow</span>
                    <span className='rp-value'>{cycleHistory.usualFlowLevel}</span>
                  </div>
                )}
                {cycleHistory.ageAtFirstPeriod && (
                  <div className='report-profile-item'>
                    <span className='rp-label'>Age at first period</span>
                    <span className='rp-value'>{cycleHistory.ageAtFirstPeriod}</span>
                  </div>
                )}
                {conditions.length > 0 && (
                  <div className='report-profile-item full-width'>
                    <span className='rp-label'>Conditions</span>
                    <span className='rp-value'>{conditions.join(', ')}</span>
                  </div>
                )}
                {cycleHistory.medications && (
                  <div className='report-profile-item full-width'>
                    <span className='rp-label'>Medications</span>
                    <span className='rp-value'>{cycleHistory.medications}</span>
                  </div>
                )}
                {cycleHistory.notes && (
                  <div className='report-profile-item full-width'>
                    <span className='rp-label'>Notes</span>
                    <span className='rp-value'>{cycleHistory.notes}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Daily Logs */}
          <div className='report-section'>
            <h3 className='report-section-title'>Daily Logs ({logs.length})</h3>
            {logs.length === 0 ? (
              <p className='report-empty'>No daily logs recorded.</p>
            ) : (
              <div className='report-logs-list'>
                {logs.map(log => (
                  <div key={log.id} className='report-log-item'>
                    <div className='report-log-date'>{formatDate(log.logDate)}</div>
                    <div className='report-log-details'>
                      {log.flowLevel && (
                        <span className={`flow-chip flow-${log.flowLevel.toLowerCase()}`}>
                          {FLOW_LABEL[log.flowLevel.toLowerCase()] || log.flowLevel}
                        </span>
                      )}
                      {log.mood && (
                        <span className='log-detail-chip'>Mood: {log.mood}</span>
                      )}
                      {log.painLevel != null && log.painLevel !== '' && (
                        <span className='log-detail-chip'>Pain: {log.painLevel}/10</span>
                      )}
                      {log.symptoms && (
                        <span className='log-detail-chip'>Symptoms: {log.symptoms}</span>
                      )}
                      {log.notes && (
                        <span className='log-detail-chip log-notes'>{log.notes}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Clinical Note Modal ──────────────────────────────────────────────────────
const ClinicalNoteModal = ({ patient, notes, noteLoading, onClose, onAdd }) => {
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    setSaveError(null)
    try {
      await onAdd(text)
      setText('')
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='report-modal-overlay' onClick={onClose}>
      <div className='report-modal cn-modal' onClick={e => e.stopPropagation()}>

        <div className='report-modal-header'>
          <div className='report-modal-title'>
            <div className='report-patient-avatar'>
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <div>
              <h2>Clinical Notes</h2>
              <p className='report-patient-email'>{patient.firstName} {patient.lastName}</p>
            </div>
          </div>
          <button className='report-close-btn' onClick={onClose}>✕</button>
        </div>

        <div className='report-modal-body'>
          <form className='cn-form' onSubmit={handleSubmit}>
            <textarea
              className='cn-textarea'
              placeholder='Write a clinical note…'
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
            />
            {saveError && <p className='cn-error'>{saveError}</p>}
            <button className='cn-submit-btn' type='submit' disabled={saving || !text.trim()}>
              {saving ? 'Saving…' : 'Add Note'}
            </button>
          </form>

          <div className='report-section'>
            <h3 className='report-section-title'>Previous Notes</h3>
            {noteLoading ? (
              <p className='report-empty'>Loading…</p>
            ) : notes.length === 0 ? (
              <p className='report-empty'>No clinical notes yet.</p>
            ) : (
              <div className='cn-notes-list'>
                {notes.map(note => (
                  <div key={note.id} className='cn-note-item'>
                    <span className='cn-note-date'>{formatDate(note.createdAt)}</span>
                    <p className='cn-note-text'>{note.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
const Patients = () => {
  const userType = useSelector(userTypeSelector)
  const token    = useSelector(tokenSelector)

  const [patients, setPatients]           = useState([])
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState(null)
  const [search, setSearch]               = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [reportData, setReportData]       = useState(null)
  const [reportLoading, setReportLoading] = useState(false)

  const [cnPatient, setCnPatient]         = useState(null)
  const [cnNotes, setCnNotes]             = useState([])
  const [cnLoading, setCnLoading]         = useState(false)

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

  const handleOpenReport = async (patient) => {
    setSelectedPatient(patient)
    setReportLoading(true)
    setReportData(null)
    try {
      const headers = { 'Content-Type': 'application/json', Authorization: token }
      const [logsRes, historyRes] = await Promise.all([
        fetch(`${SERVER}/api/patients/${patient.id}/logs`, { headers }),
        fetch(`${SERVER}/api/patients/${patient.id}/cycle-history`, { headers })
      ])
      const logs         = logsRes.ok    ? await logsRes.json()    : []
      const cycleHistory = historyRes.ok ? await historyRes.json() : {}
      setReportData({ logs, cycleHistory })
    } catch (err) {
      setReportData({ logs: [], cycleHistory: {} })
    } finally {
      setReportLoading(false)
    }
  }

  const handleCloseReport = () => {
    setSelectedPatient(null)
    setReportData(null)
  }

  const handleOpenClinicalNotes = async (patient) => {
    setCnPatient(patient)
    setCnLoading(true)
    setCnNotes([])
    try {
      const res = await fetch(`${SERVER}/api/patients/${patient.id}/clinical-notes`, {
        headers: { 'Content-Type': 'application/json', Authorization: token }
      })
      if (res.ok) setCnNotes(await res.json())
    } finally {
      setCnLoading(false)
    }
  }

  const handleAddClinicalNote = async (text) => {
    const res = await fetch(`${SERVER}/api/patients/${cnPatient.id}/clinical-notes`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ notes: text })
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Failed to save note')
    }
    const newNote = await res.json()
    setCnNotes(prev => [newNote, ...prev])
  }

  const handleCloseClinicalNotes = () => {
    setCnPatient(null)
    setCnNotes([])
  }

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
                    <h3 className='patient-name'>{patient.firstName} {patient.lastName}</h3>
                    <p className='patient-email'>{patient.email}</p>

                    <div className='patient-meta'>
                      {age !== null && <span className='meta-chip'>{age} yrs</span>}
                      {patient.height && <span className='meta-chip'>{patient.height} cm</span>}
                      {patient.weight && <span className='meta-chip'>{patient.weight} kg</span>}
                    </div>

                    {patient.notes && <p className='patient-notes'>{patient.notes}</p>}

                    <div className='patient-actions'>
                      <button
                        className='btn-reports'
                        onClick={() => handleOpenReport(patient)}
                      >
                        Reports
                      </button>
                      <button className='btn-predictions' disabled>
                        Predictions
                      </button>
                      <button
                        className='btn-clinical-notes'
                        onClick={() => handleOpenClinicalNotes(patient)}
                      >
                        Add Clinical Note
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Report Modal */}
      {selectedPatient && (
        reportLoading ? (
          <div className='report-modal-overlay'>
            <div className='report-modal report-modal-loading'>
              <p>Loading report…</p>
            </div>
          </div>
        ) : reportData && (
          <ReportModal
            patient={selectedPatient}
            reportData={reportData}
            onClose={handleCloseReport}
          />
        )
      )}

      {/* Clinical Note Modal */}
      {cnPatient && (
        <ClinicalNoteModal
          patient={cnPatient}
          notes={cnNotes}
          noteLoading={cnLoading}
          onClose={handleCloseClinicalNotes}
          onAdd={handleAddClinicalNote}
        />
      )}
    </div>
  )
}

export default Patients
