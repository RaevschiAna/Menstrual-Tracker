import './Calendar.css'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDailyLogs } from '../../stores/actions/daily-log-actions'
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const logsSelector = state => state.dailyLog.data

const dateKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

const Calendar = ({ predictedDays = [] }) => {
  const [date, setDate] = useState(new Date())
  const dispatch = useDispatch()
  const logs = useSelector(logsSelector)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      const fetchLogs = async () => {
        const action = await getDailyLogs()
        dispatch(action)
      }
      fetchLogs()
    }
  }, [dispatch])

  // Map of date key -> log data
  const logMap = React.useMemo(() => {
    const map = {}
    if (logs && logs.length) {
      logs.forEach(log => {
        const d = new Date(log.logDate)
        map[dateKey(d)] = log
      })
    }
    return map
  }, [logs])

  // Set of predicted date keys for O(1) lookup
  const predictedSet = React.useMemo(() => {
    const s = new Set()
    predictedDays.forEach(d => s.add(dateKey(new Date(d))))
    return s
  }, [predictedDays])

  const tileClassName = useCallback(({ date: tileDate, view }) => {
    if (view !== 'month') return null
    const key = dateKey(tileDate)
    const log = logMap[key]

    // Actual logged flow takes priority over prediction
    if (log) {
      const flow = (log.flowLevel || '').toLowerCase()
      if (flow === 'heavy')  return 'cal-day-heavy'
      if (flow === 'medium') return 'cal-day-medium'
      if (flow === 'light')  return 'cal-day-light'
      return 'cal-day-logged'
    }

    if (predictedSet.has(key)) return 'cal-day-predicted'

    return null
  }, [logMap, predictedSet])

  const tileContent = useCallback(({ date: tileDate, view }) => {
    if (view !== 'month') return null
    const key = dateKey(tileDate)
    const log = logMap[key]
    if (!log && !predictedSet.has(key)) return null
    return <span className={log ? 'cal-dot' : 'cal-dot-predicted'}></span>
  }, [logMap, predictedSet])

  const handleDateChange = newDate => {
    setDate(newDate)
  }

  return (
    <div className='calendar-container'>
      <div className='calendar-wrapper'>
        <ReactCalendar
          onChange={handleDateChange}
          value={date}
          className='calendar'
          locale='en-US'
          showNeighboringMonth={true}
          prev2Label='«'
          next2Label='»'
          prevLabel='‹'
          nextLabel='›'
          tileClassName={tileClassName}
          tileContent={tileContent}
        />
      </div>

      <div className='calendar-legend'>
        <span className='legend-item'><span className='legend-dot heavy'></span>Heavy</span>
        <span className='legend-item'><span className='legend-dot medium'></span>Medium</span>
        <span className='legend-item'><span className='legend-dot light'></span>Light</span>
        <span className='legend-item'><span className='legend-dot predicted'></span>Predicted</span>
      </div>
    </div>
  )
}

export default Calendar
