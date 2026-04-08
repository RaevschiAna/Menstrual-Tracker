import './DailyLogForm.css'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createDailyLog } from '../../stores/actions/daily-log-actions'
import Sidebar from '../Sidebar/Sidebar'

const userTypeSelector = state => state.user.data.type
const dailyLogLoadingSelector = state => state.dailyLog.loading

const DailyLogForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userType = useSelector(userTypeSelector)
  const loading = useSelector(dailyLogLoadingSelector)

  const [formData, setFormData] = useState({
    logDate: new Date().toISOString().split('T')[0],
    cycleDay: '',
    flowLevel: '',
    mood: '',
    painLevel: '',
    symptoms: '',
    notes: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!formData.logDate || !formData.cycleDay) {
      setError('Log date and cycle day are required')
      return
    }

    const action = await createDailyLog({
      ...formData,
      painLevel: formData.painLevel ? parseInt(formData.painLevel, 10) : null
    })
    dispatch(action).then(() => {
      setSuccess(true)
      setFormData({
        logDate: new Date().toISOString().split('T')[0],
        cycleDay: '',
        flowLevel: '',
        mood: '',
        painLevel: '',
        symptoms: '',
        notes: ''
      })
      setTimeout(() => navigate('/daily-log'), 1000)
    })
  }

  const flowOptions = ['None', 'Light', 'Medium', 'Heavy']
  const moodOptions = ['Happy', 'Calm', 'Sad', 'Anxious', 'Irritable', 'Energetic']

  return (
    <Sidebar userType={userType}>
      <div className='daily-log-form-page'>
        <h1>Daily Log Entry</h1>

        {error && <div className='dlf-error'>{error}</div>}
        {success && <div className='dlf-success'>Daily log saved!</div>}

        <form className='dlf-form' onSubmit={handleSubmit}>
          {/* Date & Cycle Day */}
          <div className='dlf-row'>
            <div className='dlf-field'>
              <label>Date</label>
              <input
                type='date'
                name='logDate'
                value={formData.logDate}
                onChange={handleChange}
              />
            </div>
            <div className='dlf-field'>
              <label>Cycle Day</label>
              <input
                type='text'
                name='cycleDay'
                value={formData.cycleDay}
                onChange={handleChange}
                placeholder='e.g. Day 5'
              />
            </div>
          </div>

          {/* Flow Level */}
          <div className='dlf-field'>
            <label>Flow Level</label>
            <div className='dlf-options'>
              {flowOptions.map(opt => (
                <button
                  key={opt}
                  type='button'
                  className={`dlf-option ${formData.flowLevel === opt ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, flowLevel: opt })}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className='dlf-field'>
            <label>Mood</label>
            <div className='dlf-options'>
              {moodOptions.map(opt => (
                <button
                  key={opt}
                  type='button'
                  className={`dlf-option ${formData.mood === opt ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, mood: opt })}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Pain Level */}
          <div className='dlf-field'>
            <label>Pain Level (0-10)</label>
            <input
              type='range'
              name='painLevel'
              min='0'
              max='10'
              value={formData.painLevel || 0}
              onChange={handleChange}
            />
            <span className='dlf-pain-val'>{formData.painLevel || 0}</span>
          </div>

          {/* Symptoms */}
          <div className='dlf-field'>
            <label>Symptoms</label>
            <textarea
              name='symptoms'
              value={formData.symptoms}
              onChange={handleChange}
              placeholder='e.g. Headache, Cramps, Bloating...'
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className='dlf-field'>
            <label>Notes</label>
            <textarea
              name='notes'
              value={formData.notes}
              onChange={handleChange}
              placeholder='Anything else to note...'
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className='dlf-actions'>
            <button type='submit' className='dlf-btn-save' disabled={loading}>
              {loading ? 'Saving...' : 'Save Log'}
            </button>
            <button type='button' className='dlf-btn-cancel' onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  )
}

export default DailyLogForm
