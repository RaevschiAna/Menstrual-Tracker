import './Patients.css'
import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell
} from 'recharts'
import { SERVER } from '../../config/global'
import { predictNextPeriod } from '../../utils/cyclePredictor'

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

// ── Chart helpers ────────────────────────────────────────────────────────────
const MS_PER_DAY   = 1000 * 60 * 60 * 24
const FLOW_ORDER   = { none: 0, light: 1, medium: 2, heavy: 3 }
const FLOW_TICK    = { 0: 'None', 1: 'Light', 2: 'Medium', 3: 'Heavy' }
const FLOW_COLOR   = { 0: '#f0f0f0', 1: '#f2b8b5', 2: '#e8938f', 3: '#d4605e' }
const MOOD_COLORS  = {
  Happy: '#f9c74f', Calm: '#90be6d', Sad: '#577590',
  Anxious: '#f8961e', Irritable: '#f94144', Energetic: '#43aa8b'
}
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const fmtShort = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`
}

function groupPeriods(dates, gapDays = 2) {
  const out = []
  let cur = null
  for (const d of dates) {
    if (!cur) { cur = { start: d, end: d } }
    else if (Math.round((d - cur.end) / MS_PER_DAY) <= gapDays) { cur.end = d }
    else { out.push(cur); cur = { start: d, end: d } }
  }
  if (cur) out.push(cur)
  return out
}

const ChartEmpty = ({ msg }) => (
  <div className='pm-chart-empty'>{msg || 'Not enough data yet.'}</div>
)

const FlowTip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className='pm-tooltip'><b>{label}</b><span>{FLOW_TICK[payload[0].value] || 'None'}</span></div>
  ) : null

const PainTip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className='pm-tooltip'><b>{label}</b><span>Pain: {payload[0].value}/10</span></div>
  ) : null

const MoodTip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className='pm-tooltip'><b>{label}</b><span>{payload[0].value} entries</span></div>
  ) : null

const SymTip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className='pm-tooltip'><b>{label}</b><span>{payload[0].value}×</span></div>
  ) : null

const CycleTip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className='pm-tooltip'><b>{label}</b><span>{payload[0].value} days</span></div>
  ) : null

// ── Predictions Modal ─────────────────────────────────────────────────────────
const PredictionsModal = ({ patient, predData, onClose }) => {
  const { logs, cycleHistory } = predData

  const prediction = useMemo(() => predictNextPeriod(logs, cycleHistory), [logs, cycleHistory])

  const flowData = useMemo(() =>
    [...(logs || [])].sort((a, b) => new Date(a.logDate) - new Date(b.logDate)).map(l => ({
      date: fmtShort(l.logDate),
      flow: FLOW_ORDER[(l.flowLevel || 'none').toLowerCase()] ?? 0
    })), [logs])

  const painData = useMemo(() =>
    [...(logs || [])].sort((a, b) => new Date(a.logDate) - new Date(b.logDate))
      .filter(l => l.painLevel != null && l.painLevel !== '')
      .map(l => ({ date: fmtShort(l.logDate), pain: Number(l.painLevel) })),
    [logs])

  const moodData = useMemo(() => {
    const counts = {}
    ;(logs || []).forEach(l => { if (l.mood) counts[l.mood] = (counts[l.mood] || 0) + 1 })
    return Object.entries(counts).map(([mood, count]) => ({ mood, count })).sort((a, b) => b.count - a.count)
  }, [logs])

  const symptomsData = useMemo(() => {
    const counts = {}
    ;(logs || []).forEach(l => {
      if (!l.symptoms) return
      l.symptoms.split(',').forEach(s => { const t = s.trim(); if (t) counts[t] = (counts[t] || 0) + 1 })
    })
    return Object.entries(counts).map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count).slice(0, 6)
  }, [logs])

  const cycleLengthData = useMemo(() => {
    const flowDates = (logs || [])
      .filter(l => l.flowLevel && l.flowLevel.toLowerCase() !== 'none' && l.flowLevel.trim())
      .map(l => new Date(l.logDate)).sort((a, b) => a - b)
    const periods = groupPeriods(flowDates)
    if (periods.length < 2) return []
    return periods.slice(0, -1).map((p, i) => ({
      cycle: `Cycle ${i + 1}`,
      length: Math.round((periods[i + 1].start - p.start) / MS_PER_DAY)
    }))
  }, [logs])

  const avgCycleLength = cycleHistory?.cycleLength || 28

  const nextDate = prediction.nextPeriodStart
  const nextDateStr = nextDate
    ? nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div className='report-modal-overlay' onClick={onClose}>
      <div className='report-modal pm-modal' onClick={e => e.stopPropagation()}>

        <div className='report-modal-header'>
          <div className='report-modal-title'>
            <div className='report-patient-avatar'>
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <div>
              <h2>Predictions</h2>
              <p className='report-patient-email'>{patient.firstName} {patient.lastName}</p>
            </div>
          </div>
          <button className='report-close-btn' onClick={onClose}>✕</button>
        </div>

        <div className='report-modal-body'>

          {/* Next period banner */}
          <div className='pm-next-period'>
            <div className='pm-next-label'>Next Predicted Period</div>
            <div className='pm-next-date'>{nextDateStr}</div>
            <div className='pm-next-confidence'>
              {prediction.confidence === 'high'   ? `Based on ${prediction.basedOn}` :
               prediction.confidence === 'medium' ? `Estimated · ${prediction.basedOn}` :
               'Not enough data yet'}
            </div>
          </div>

          {/* Chart 1 – Flow Level Timeline */}
          <div className='pm-chart-card'>
            <h3 className='pm-chart-title'>Flow Level Timeline</h3>
            {flowData.length === 0 ? <ChartEmpty /> : (
              <ResponsiveContainer width='100%' height={180}>
                <BarChart data={flowData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='date' tick={{ fontSize: 10 }} interval='preserveStartEnd' />
                  <YAxis domain={[0, 3]} ticks={[0,1,2,3]} tickFormatter={v => FLOW_TICK[v] || ''} tick={{ fontSize: 10 }} width={44} />
                  <Tooltip content={<FlowTip />} />
                  <Bar dataKey='flow' radius={[3, 3, 0, 0]}>
                    {flowData.map((e, i) => <Cell key={i} fill={FLOW_COLOR[e.flow] || '#f0f0f0'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Chart 2 – Pain Level */}
          <div className='pm-chart-card'>
            <h3 className='pm-chart-title'>Pain Level Over Time</h3>
            {painData.length === 0 ? <ChartEmpty msg='No pain data logged.' /> : (
              <ResponsiveContainer width='100%' height={180}>
                <AreaChart data={painData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                  <defs>
                    <linearGradient id='pmPainGrad' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#e8938f' stopOpacity={0.4} />
                      <stop offset='95%' stopColor='#e8938f' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='date' tick={{ fontSize: 10 }} interval='preserveStartEnd' />
                  <YAxis domain={[0, 10]} ticks={[0,2,4,6,8,10]} tick={{ fontSize: 10 }} width={24} />
                  <Tooltip content={<PainTip />} />
                  <Area type='monotone' dataKey='pain' stroke='#d4605e' strokeWidth={2}
                    fill='url(#pmPainGrad)' dot={{ r: 3, fill: '#d4605e', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Charts 3 & 4 side by side */}
          <div className='pm-row'>
            <div className='pm-chart-card'>
              <h3 className='pm-chart-title'>Mood Distribution</h3>
              {moodData.length === 0 ? <ChartEmpty msg='No mood data.' /> : (
                <ResponsiveContainer width='100%' height={180}>
                  <BarChart data={moodData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='mood' tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={24} />
                    <Tooltip content={<MoodTip />} />
                    <Bar dataKey='count' radius={[3, 3, 0, 0]}>
                      {moodData.map((e, i) => <Cell key={i} fill={MOOD_COLORS[e.mood] || '#a78bda'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className='pm-chart-card'>
              <h3 className='pm-chart-title'>Symptoms Frequency</h3>
              {symptomsData.length === 0 ? <ChartEmpty msg='No symptoms logged.' /> : (
                <ResponsiveContainer width='100%' height={180}>
                  <BarChart data={symptomsData} layout='vertical'
                    margin={{ top: 4, right: 20, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' horizontal={false} />
                    <XAxis type='number' allowDecimals={false} tick={{ fontSize: 10 }} />
                    <YAxis type='category' dataKey='symptom' tick={{ fontSize: 10 }} width={72} />
                    <Tooltip content={<SymTip />} />
                    <Bar dataKey='count' fill='#7c5cbf' radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 5 – Cycle Length History */}
          <div className='pm-chart-card'>
            <h3 className='pm-chart-title'>
              Cycle Length History
              <span className='pm-chart-sub'> · avg {avgCycleLength} days (dashed)</span>
            </h3>
            {cycleLengthData.length === 0 ? (
              <ChartEmpty msg='Need at least 2 logged periods to calculate cycle lengths.' />
            ) : (
              <ResponsiveContainer width='100%' height={180}>
                <BarChart data={cycleLengthData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='cycle' tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={32} domain={['auto', 'auto']} />
                  <Tooltip content={<CycleTip />} />
                  <ReferenceLine y={avgCycleLength} stroke='#d4605e' strokeDasharray='6 3' strokeWidth={2} />
                  <Bar dataKey='length' fill='#e8938f' radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      </div>
    </div>
  )
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

  const [predPatient, setPredPatient]     = useState(null)
  const [predData, setPredData]           = useState(null)
  const [predLoading, setPredLoading]     = useState(false)

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

  const handleOpenPredictions = async (patient) => {
    setPredPatient(patient)
    setPredLoading(true)
    setPredData(null)
    try {
      const headers = { 'Content-Type': 'application/json', Authorization: token }
      const [logsRes, historyRes] = await Promise.all([
        fetch(`${SERVER}/api/patients/${patient.id}/logs`, { headers }),
        fetch(`${SERVER}/api/patients/${patient.id}/cycle-history`, { headers })
      ])
      const logs         = logsRes.ok    ? await logsRes.json()    : []
      const cycleHistory = historyRes.ok ? await historyRes.json() : {}
      setPredData({ logs, cycleHistory })
    } catch {
      setPredData({ logs: [], cycleHistory: {} })
    } finally {
      setPredLoading(false)
    }
  }

  const handleClosePredictions = () => {
    setPredPatient(null)
    setPredData(null)
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
                      <button
                        className='btn-predictions'
                        onClick={() => handleOpenPredictions(patient)}
                      >
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

      {/* Predictions Modal */}
      {predPatient && (
        predLoading ? (
          <div className='report-modal-overlay'>
            <div className='report-modal report-modal-loading'>
              <p>Loading predictions…</p>
            </div>
          </div>
        ) : predData && (
          <PredictionsModal
            patient={predPatient}
            predData={predData}
            onClose={handleClosePredictions}
          />
        )
      )}
    </div>
  )
}

export default Patients
