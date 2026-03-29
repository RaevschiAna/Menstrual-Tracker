import './DailyLogList.css'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDailyLogs } from '../../stores/actions/daily-log-actions'
import Sidebar from '../Sidebar/Sidebar'

const userTypeSelector = state => state.user.data.type
const logsSelector = state => state.dailyLog.data
const loadingSelector = state => state.dailyLog.loading

const DailyLogList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userType = useSelector(userTypeSelector)
  const logs = useSelector(logsSelector)
  const loading = useSelector(loadingSelector)

  useEffect(() => {
    const fetchLogs = async () => {
      const action = await getDailyLogs()
      dispatch(action)
    }
    fetchLogs()
  }, [dispatch])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Sidebar userType={userType}>
      <div className='daily-log-list-page'>
        <div className='dll-header'>
          <h1>Daily Logs</h1>
          <button className='dll-btn-add' onClick={() => navigate('/daily-log/new')}>
            + Add New Log
          </button>
        </div>

        {loading && <p className='dll-loading'>Loading logs...</p>}

        {!loading && logs.length === 0 && (
          <div className='dll-empty'>
            <p>No daily logs yet.</p>
            <p>Start tracking by adding your first log!</p>
          </div>
        )}

        {!loading && logs.length > 0 && (
          <div className='dll-cards'>
            {logs.map(log => (
              <div key={log.id} className='dll-card'>
                <div className='dll-card-header'>
                  <span className='dll-card-date'>{formatDate(log.logDate)}</span>
                  <span className='dll-card-day'>{log.cycleDay}</span>
                </div>
                <div className='dll-card-body'>
                  {log.flowLevel && (
                    <div className='dll-tag'>
                      <span className='dll-tag-label'>Flow</span>
                      <span className='dll-tag-value'>{log.flowLevel}</span>
                    </div>
                  )}
                  {log.mood && (
                    <div className='dll-tag'>
                      <span className='dll-tag-label'>Mood</span>
                      <span className='dll-tag-value'>{log.mood}</span>
                    </div>
                  )}
                  {log.painLevel != null && (
                    <div className='dll-tag'>
                      <span className='dll-tag-label'>Pain</span>
                      <span className='dll-tag-value'>{log.painLevel}/10</span>
                    </div>
                  )}
                </div>
                {log.symptoms && (
                  <p className='dll-card-symptoms'>{log.symptoms}</p>
                )}
                {log.notes && (
                  <p className='dll-card-notes'>{log.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  )
}

export default DailyLogList
