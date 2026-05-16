import './Predictions.css'
import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell
} from 'recharts'
import Sidebar from '../Sidebar/Sidebar'
import { getDailyLogs } from '../../stores/actions/daily-log-actions'
import { getCycleHistory } from '../../stores/actions/cycle-actions'

const logsSelector        = state => state.dailyLog.data
const cycleHistorySelector = state => state.cycle.data
const userTypeSelector    = state => state.user.data.type

const MS_PER_DAY = 1000 * 60 * 60 * 24

const FLOW_ORDER = { none: 0, light: 1, medium: 2, heavy: 3 }
const FLOW_TICK  = { 0: 'None', 1: 'Light', 2: 'Medium', 3: 'Heavy' }
const FLOW_COLOR = { 0: '#f0f0f0', 1: '#f2b8b5', 2: '#e8938f', 3: '#d4605e' }

const MOOD_COLORS = {
  Happy: '#f9c74f', Calm: '#90be6d', Sad: '#577590',
  Anxious: '#f8961e', Irritable: '#f94144', Energetic: '#43aa8b'
}

const formatDateShort = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]}`
}

// Groups sorted Date objects into period clusters (gap ≤ gapDays)
function groupIntoPeriods(dates, gapDays = 2) {
  const periods = []
  let current = null
  for (const d of dates) {
    if (!current) {
      current = { start: d, end: d }
    } else {
      const gap = Math.round((d - current.end) / MS_PER_DAY)
      if (gap <= gapDays) {
        current.end = d
      } else {
        periods.push(current)
        current = { start: d, end: d }
      }
    }
  }
  if (current) periods.push(current)
  return periods
}

// ── Empty state ──────────────────────────────────────────────────────────────
const EmptyChart = ({ message }) => (
  <div className='pred-empty'>
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
      <path d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'/>
    </svg>
    <p>{message || 'Not enough data yet. Keep logging!'}</p>
  </div>
)

// ── Custom tooltip ────────────────────────────────────────────────────────────
const FlowTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  return (
    <div className='pred-tooltip'>
      <p className='pred-tooltip-date'>{label}</p>
      <p className='pred-tooltip-val'>{FLOW_TICK[val] || 'None'}</p>
    </div>
  )
}

const PainTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className='pred-tooltip'>
      <p className='pred-tooltip-date'>{label}</p>
      <p className='pred-tooltip-val'>Pain: {payload[0].value}/10</p>
    </div>
  )
}

const MoodTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className='pred-tooltip'>
      <p className='pred-tooltip-date'>{label}</p>
      <p className='pred-tooltip-val'>{payload[0].value} entries</p>
    </div>
  )
}

const SymptomsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className='pred-tooltip'>
      <p className='pred-tooltip-date'>{label}</p>
      <p className='pred-tooltip-val'>{payload[0].value} occurrences</p>
    </div>
  )
}

const CycleTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className='pred-tooltip'>
      <p className='pred-tooltip-date'>{label}</p>
      <p className='pred-tooltip-val'>{payload[0].value} days</p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
const Predictions = ({ onLogout }) => {
  const dispatch     = useDispatch()
  const logs         = useSelector(logsSelector)
  const cycleHistory = useSelector(cycleHistorySelector)
  const userType     = useSelector(userTypeSelector)

  useEffect(() => {
    const load = async () => {
      dispatch(await getDailyLogs())
      dispatch(await getCycleHistory())
    }
    load()
  }, [dispatch])

  // ── 1. Flow Level Timeline ────────────────────────────────────────────────
  const flowData = useMemo(() => {
    if (!logs?.length) return []
    return [...logs]
      .sort((a, b) => new Date(a.logDate) - new Date(b.logDate))
      .map(l => ({
        date: formatDateShort(l.logDate),
        flow: FLOW_ORDER[(l.flowLevel || 'none').toLowerCase()] ?? 0
      }))
  }, [logs])

  // ── 2. Pain Level Over Time ───────────────────────────────────────────────
  const painData = useMemo(() => {
    if (!logs?.length) return []
    return [...logs]
      .sort((a, b) => new Date(a.logDate) - new Date(b.logDate))
      .filter(l => l.painLevel != null && l.painLevel !== '')
      .map(l => ({
        date: formatDateShort(l.logDate),
        pain: Number(l.painLevel)
      }))
  }, [logs])

  // ── 3. Mood Distribution ─────────────────────────────────────────────────
  const moodData = useMemo(() => {
    if (!logs?.length) return []
    const counts = {}
    logs.forEach(l => {
      if (l.mood) counts[l.mood] = (counts[l.mood] || 0) + 1
    })
    return Object.entries(counts)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count)
  }, [logs])

  // ── 4. Symptoms Frequency ────────────────────────────────────────────────
  const symptomsData = useMemo(() => {
    if (!logs?.length) return []
    const counts = {}
    logs.forEach(l => {
      if (!l.symptoms) return
      l.symptoms.split(',').forEach(s => {
        const trimmed = s.trim()
        if (trimmed) counts[trimmed] = (counts[trimmed] || 0) + 1
      })
    })
    return Object.entries(counts)
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [logs])

  // ── 5. Cycle Length History ──────────────────────────────────────────────
  const cycleLengthData = useMemo(() => {
    if (!logs?.length) return []
    const flowDates = logs
      .filter(l => l.flowLevel && l.flowLevel.toLowerCase() !== 'none' && l.flowLevel.trim() !== '')
      .map(l => new Date(l.logDate))
      .sort((a, b) => a - b)

    const periods = groupIntoPeriods(flowDates)
    if (periods.length < 2) return []

    return periods.slice(0, -1).map((p, i) => ({
      cycle: `Cycle ${i + 1}`,
      length: Math.round((periods[i + 1].start - p.start) / MS_PER_DAY)
    }))
  }, [logs])

  const avgCycleLength = cycleHistory?.cycleLength || 28

  return (
    <Sidebar userType={userType} onLogout={onLogout}>
      <div className='pred-container'>
        <div className='pred-header'>
          <h2>Insights &amp; Predictions</h2>
          <p className='pred-subtitle'>Visualisations based on your logged data</p>
        </div>

        <div className='pred-body'>

          {/* ── Chart 1: Flow Level Timeline ── */}
          <div className='pred-card'>
            <h3 className='pred-card-title'>Flow Level Timeline</h3>
            {flowData.length === 0 ? <EmptyChart /> : (
              <ResponsiveContainer width='100%' height={240}>
                <BarChart data={flowData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='date' tick={{ fontSize: 11 }} interval='preserveStartEnd' />
                  <YAxis
                    domain={[0, 3]}
                    ticks={[0, 1, 2, 3]}
                    tickFormatter={v => FLOW_TICK[v] || ''}
                    tick={{ fontSize: 11 }}
                    width={48}
                  />
                  <Tooltip content={<FlowTooltip />} />
                  <Bar dataKey='flow' radius={[4, 4, 0, 0]}>
                    {flowData.map((entry, i) => (
                      <Cell key={i} fill={FLOW_COLOR[entry.flow] || '#f0f0f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Chart 2: Pain Level Over Time ── */}
          <div className='pred-card'>
            <h3 className='pred-card-title'>Pain Level Over Time</h3>
            {painData.length === 0 ? <EmptyChart message='No pain data logged yet.' /> : (
              <ResponsiveContainer width='100%' height={240}>
                <AreaChart data={painData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <defs>
                    <linearGradient id='painGrad' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#e8938f' stopOpacity={0.4} />
                      <stop offset='95%' stopColor='#e8938f' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='date' tick={{ fontSize: 11 }} interval='preserveStartEnd' />
                  <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11 }} width={28} />
                  <Tooltip content={<PainTooltip />} />
                  <Area
                    type='monotone'
                    dataKey='pain'
                    stroke='#d4605e'
                    strokeWidth={2}
                    fill='url(#painGrad)'
                    dot={{ r: 4, fill: '#d4605e', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Chart 3: Mood Distribution ── */}
          <div className='pred-card'>
            <h3 className='pred-card-title'>Mood Distribution</h3>
            {moodData.length === 0 ? <EmptyChart message='No mood data logged yet.' /> : (
              <ResponsiveContainer width='100%' height={240}>
                <BarChart data={moodData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='mood' tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                  <Tooltip content={<MoodTooltip />} />
                  <Bar dataKey='count' radius={[4, 4, 0, 0]}>
                    {moodData.map((entry, i) => (
                      <Cell key={i} fill={MOOD_COLORS[entry.mood] || '#a78bda'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Chart 4: Symptoms Frequency ── */}
          <div className='pred-card'>
            <h3 className='pred-card-title'>Symptoms Frequency</h3>
            {symptomsData.length === 0 ? <EmptyChart message='No symptoms logged yet.' /> : (
              <ResponsiveContainer width='100%' height={240}>
                <BarChart
                  data={symptomsData}
                  layout='vertical'
                  margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' horizontal={false} />
                  <XAxis type='number' allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    type='category'
                    dataKey='symptom'
                    tick={{ fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip content={<SymptomsTooltip />} />
                  <Bar dataKey='count' fill='#7c5cbf' radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Chart 5: Cycle Length History (full width) ── */}
          <div className='pred-card pred-card-full'>
            <h3 className='pred-card-title'>Cycle Length History</h3>
            <p className='pred-card-sub'>Dashed line = your configured average ({avgCycleLength} days)</p>
            {cycleLengthData.length === 0 ? (
              <EmptyChart message='At least 2 logged periods are needed to calculate cycle lengths.' />
            ) : (
              <ResponsiveContainer width='100%' height={240}>
                <BarChart data={cycleLengthData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='cycle' tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={36} domain={['auto', 'auto']} />
                  <Tooltip content={<CycleTooltip />} />
                  <ReferenceLine
                    y={avgCycleLength}
                    stroke='#d4605e'
                    strokeDasharray='6 3'
                    strokeWidth={2}
                  />
                  <Bar dataKey='length' fill='#e8938f' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      </div>
    </Sidebar>
  )
}

export default Predictions
