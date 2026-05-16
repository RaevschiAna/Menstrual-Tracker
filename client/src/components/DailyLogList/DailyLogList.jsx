import './DailyLogList.css'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDailyLogs } from '../../stores/actions/daily-log-actions'
import Sidebar from '../Sidebar/Sidebar'
import { SERVER } from '../../config/global'

const userTypeSelector = state => state.user.data.type
const userSelector = state => state.user.data
const logsSelector = state => state.dailyLog.data
const loadingSelector = state => state.dailyLog.loading

const DailyLogList = ({ onLogout }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userType = useSelector(userTypeSelector)
  const user = useSelector(userSelector)
  const logs = useSelector(logsSelector)
  const loading = useSelector(loadingSelector)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('date')

  useEffect(() => {
    const fetchLogs = async () => {
      const action = await getDailyLogs()
      dispatch(action)
    }
    fetchLogs()
  }, [dispatch])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const FLOW_ORDER = { heavy: 3, medium: 2, light: 1 }

  const getFilteredSortedLogs = () => {
    let result = [...logs]

    if (filter === 'today') {
      const today = new Date().toDateString()
      result = result.filter(log => new Date(log.logDate).toDateString() === today)
    }

    if (sort === 'date') {
      result.sort((a, b) => new Date(b.logDate) - new Date(a.logDate))
    } else if (sort === 'flow') {
      result.sort((a, b) => {
        const fa = FLOW_ORDER[(a.flowLevel || '').toLowerCase()] || 0
        const fb = FLOW_ORDER[(b.flowLevel || '').toLowerCase()] || 0
        return fb - fa
      })
    } else if (sort === 'pain') {
      result.sort((a, b) => (b.painLevel ?? 0) - (a.painLevel ?? 0))
    }

    return result
  }

  const filteredLogs = getFilteredSortedLogs()

  return (
    <Sidebar userType={userType} onLogout={onLogout}>
      <div className='daily-log-list-page'>
        {/* Header */}
        <div className='dll-top-header'>
          <h1>Daily Log Entry</h1>
          <select
            className='dll-sort-select'
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value='date'>Sort by Date</option>
            <option value='flow'>Sort by Flow</option>
            <option value='pain'>Sort by Pain</option>
          </select>
        </div>

        {/* Filter tabs */}
        <div className='dll-filters'>
          <button
            className={`dll-filter-tab ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >Today</button>
          <button
            className={`dll-filter-tab ${filter === 'summary' ? 'active' : ''}`}
            onClick={() => setFilter('summary')}
          >Summary</button>
          <button
            className={`dll-filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >All Logs</button>
        </div>

        {loading && <p className='dll-loading'>Loading logs...</p>}

        {!loading && filteredLogs.length === 0 && (
          <div className='dll-empty'>
            <p>No daily logs yet.</p>
            <p>Start tracking by adding your first log!</p>
          </div>
        )}

        {!loading && filteredLogs.length > 0 && (
          <div className='dll-entries'>
            <div className='dll-entries-header'>
              <span className='dll-entries-title'>Your Tracked Logs:</span>
            </div>

            {filteredLogs.map(log => (
              <div key={log.id} className='dll-entry-row'>
                <div className='dll-entry-avatar'>
                  {user?.profilePicture
                    ? <img src={`${SERVER}/uploads/${user.profilePicture}`} alt='Profile' className='dll-entry-avatar-img' />
                    : (user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'P')
                  }
                </div>
                <div className='dll-entry-info'>
                  <span className='dll-entry-name'>{user?.firstName || 'Patient'} {user?.lastName || ''}</span>
                  <span className='dll-entry-date'>{formatDate(log.logDate)}, {log.cycleDay}</span>
                </div>
                <div className='dll-entry-meta'>
                  <div className='dll-entry-detail'>
                    <span className='dll-entry-meta-label'>Log Date</span>
                    <span className='dll-entry-meta-value'>{formatDate(log.logDate)}</span>
                  </div>
                  <div className='dll-entry-detail'>
                    <span className='dll-entry-meta-label'>Created</span>
                    <span className='dll-entry-meta-value'>{formatTime(log.createdAt)}</span>
                  </div>
                </div>
                <div className='dll-entry-tags'>
                  {log.flowLevel ? <span className='dll-entry-tag flow'>{log.flowLevel}</span> : null}
                  {log.mood ? <span className='dll-entry-tag mood'>{log.mood}</span> : null}
                  {log.painLevel != null && log.painLevel > 0 ? <span className='dll-entry-tag pain'>Pain: {log.painLevel}/10</span> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  )
}

export default DailyLogList
