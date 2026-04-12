import './Calendar.css'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDailyLogs } from '../../stores/actions/daily-log-actions'
import ReactCalendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const logsSelector = state => state.dailyLog.data

const Calendar = () => {
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

  // Build a map of date string -> log data for quick lookup
  const logMap = React.useMemo(() => {
    const map = {}
    if (logs && logs.length) {
      logs.forEach(log => {
        const d = new Date(log.logDate)
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        map[key] = log
      })
    }
    return map
  }, [logs])

  const tileClassName = useCallback(({ date: tileDate, view }) => {
    if (view !== 'month') return null
    const key = `${tileDate.getFullYear()}-${tileDate.getMonth()}-${tileDate.getDate()}`
    const log = logMap[key]
    if (!log) return null

    const flow = (log.flowLevel || '').toLowerCase()
    if (flow === 'heavy') return 'cal-day-heavy'
    if (flow === 'medium') return 'cal-day-medium'
    if (flow === 'light') return 'cal-day-light'
    return 'cal-day-logged'
  }, [logMap])

  const tileContent = useCallback(({ date: tileDate, view }) => {
    if (view !== 'month') return null
    const key = `${tileDate.getFullYear()}-${tileDate.getMonth()}-${tileDate.getDate()}`
    const log = logMap[key]
    if (!log) return null
    return <span className='cal-dot'></span>
  }, [logMap])

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
    </div>
  )
}

export default Calendar
