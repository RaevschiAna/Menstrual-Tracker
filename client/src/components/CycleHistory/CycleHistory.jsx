import './CycleHistory.css'
import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCycleHistory, saveCycleHistory, updateCycleHistory } from '../../stores/actions/cycle-actions'
import Sidebar from '../Sidebar/Sidebar'

const userTypeSelector = state => state.user.data.type
const cycleDataSelector = state => state.cycle.data
const cycleLoadingSelector = state => state.cycle.loading
const cycleErrorSelector = state => state.cycle.error

const CycleHistory = ({ onLogout }) => {
  const dispatch = useDispatch()
  const userType = useSelector(userTypeSelector)
  const cycleData = useSelector(cycleDataSelector)
  const loading = useSelector(cycleLoadingSelector)
  const error = useSelector(cycleErrorSelector)
  const hasInitialized = useRef(false)

  const [formData, setFormData] = useState({
    ageAtFirstPeriod: '',
    cycleLength: '',
    periodDuration: '',
    usualFlowLevel: 'Light',
    conditionsPMDD: false,
    conditionsPMS: false,
    conditionsEndometriosis: false,
    conditionsPCOS: false,
    conditionsFibroid: false,
    otherConditions: '',
    medications: '',
    notes: ''
  })

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      const fetchCycleHistory = async () => {
        const action = await getCycleHistory()
        dispatch(action)
      }
      fetchCycleHistory()
    }
  }, [])

  useEffect(() => {
    if (hasInitialized.current && !loading) {
      // If data exists and has an id (meaning it was saved), populate form
      if (cycleData && cycleData.id) {
        setFormData({
          ageAtFirstPeriod: cycleData.ageAtFirstPeriod || '',
          cycleLength: cycleData.cycleLength || '',
          periodDuration: cycleData.periodDuration || '',
          usualFlowLevel: cycleData.usualFlowLevel || 'Light',
          conditionsPMDD: cycleData.conditionsPMDD || false,
          conditionsPMS: cycleData.conditionsPMS || false,
          conditionsEndometriosis: cycleData.conditionsEndometriosis || false,
          conditionsPCOS: cycleData.conditionsPCOS || false,
          conditionsFibroid: cycleData.conditionsFibroid || false,
          otherConditions: cycleData.otherConditions || '',
          medications: cycleData.medications || '',
          notes: cycleData.notes || ''
        })
        setIsEditing(false)
      } else {
        // No existing data, allow user to create new
        setIsEditing(true)
      }
    }
  }, [loading])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    
    try {
      let action
      if (Object.keys(cycleData).length > 0) {
        action = await updateCycleHistory(formData)
        setMessageType('success')
        setMessage('Cycle history updated successfully!')
      } else {
        action = await saveCycleHistory(formData)
        setMessageType('success')
        setMessage('Cycle history saved successfully!')
      }
      dispatch(action).then(() => {
        setIsEditing(false)
      })
    } catch (err) {
      setMessageType('error')
      setMessage(err.message || 'Failed to save cycle history')
    }
  }

  return (
    <Sidebar userType={userType} onLogout={onLogout}>
      <div className='cycle-history-page'>
        <h1>Medical & Cycle History</h1>
        <p className='ch-subtitle'>Complete this form once. You can edit it anytime if needed.</p>

        {error && <div className='ch-error'>{error}</div>}
        {message && <div className={`ch-${messageType}`}>{message}</div>}

        {loading && <div className='ch-loading'>Loading cycle history...</div>}

        {!loading && !isEditing && cycleData && cycleData.id && (
          <div className='ch-display-view'>
            {/* Personal History Display */}
            <div className='ch-display-card'>
              <h2>Personal Menstrual History</h2>
              <div className='ch-display-list'>
                {formData.ageAtFirstPeriod && (
                  <div className='ch-display-row'>
                    <span className='ch-display-label'>Age at First Period</span>
                    <span className='ch-display-value'>{formData.ageAtFirstPeriod} years old</span>
                  </div>
                )}
                {formData.cycleLength && (
                  <div className='ch-display-row'>
                    <span className='ch-display-label'>Average Cycle Length</span>
                    <span className='ch-display-value'>{formData.cycleLength} days</span>
                  </div>
                )}
                {formData.periodDuration && (
                  <div className='ch-display-row'>
                    <span className='ch-display-label'>Average Period Duration</span>
                    <span className='ch-display-value'>{formData.periodDuration} days</span>
                  </div>
                )}
                {formData.usualFlowLevel && (
                  <div className='ch-display-row'>
                    <span className='ch-display-label'>Usual Flow Level</span>
                    <span className='ch-display-value'>{formData.usualFlowLevel}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Health Conditions Display */}
            {(formData.conditionsPMDD || formData.conditionsPMS || formData.conditionsEndometriosis || 
              formData.conditionsPCOS || formData.conditionsFibroid || formData.otherConditions) && (
              <div className='ch-display-card'>
                <h2>Health Conditions & Diagnostics</h2>
                <div className='ch-conditions-list'>
                  {formData.conditionsPMDD && <span className='ch-condition-tag'>PMDD</span>}
                  {formData.conditionsPMS && <span className='ch-condition-tag'>PMS</span>}
                  {formData.conditionsEndometriosis && <span className='ch-condition-tag'>Endometriosis</span>}
                  {formData.conditionsPCOS && <span className='ch-condition-tag'>PCOS</span>}
                  {formData.conditionsFibroid && <span className='ch-condition-tag'>Uterine Fibroid</span>}
                </div>
                {formData.otherConditions && (
                  <div className='ch-display-row'>
                    <span className='ch-display-label'>Other Conditions</span>
                    <span className='ch-display-value'>{formData.otherConditions}</span>
                  </div>
                )}
              </div>
            )}

            {/* Medications Display */}
            {formData.medications && (
              <div className='ch-display-card'>
                <h2>Current Medications</h2>
                <div className='ch-display-row'>
                  <span className='ch-display-value'>{formData.medications}</span>
                </div>
              </div>
            )}

            {/* Notes Display */}
            {formData.notes && (
              <div className='ch-display-card'>
                <h2>Additional Notes</h2>
                <div className='ch-display-row'>
                  <span className='ch-display-value'>{formData.notes}</span>
                </div>
              </div>
            )}

            {/* Edit Button */}
            <div className='ch-actions'>
              <button
                type='button'
                className='ch-btn-edit'
                onClick={() => setIsEditing(true)}
              >
                Edit History
              </button>
            </div>
          </div>
        )}

        {!loading && isEditing && (
          <form className='ch-form' onSubmit={handleSubmit}>
            {/* Personal History Section */}
            <fieldset className='ch-fieldset'>
              <legend>Personal Menstrual History</legend>
              
              <div className='ch-field'>
                <label htmlFor='ageAtFirstPeriod'>Age at First Period (Menarche)</label>
                <input
                  type='number'
                  id='ageAtFirstPeriod'
                  name='ageAtFirstPeriod'
                  value={formData.ageAtFirstPeriod}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder='e.g., 13'
                  min='8'
                  max='20'
                />
              </div>

              <div className='ch-row'>
                <div className='ch-field'>
                  <label htmlFor='cycleLength'>Average Cycle Length (days)</label>
                  <input
                    type='number'
                    id='cycleLength'
                    name='cycleLength'
                    value={formData.cycleLength}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder='e.g., 28'
                    min='21'
                    max='35'
                  />
                </div>

                <div className='ch-field'>
                  <label htmlFor='periodDuration'>Average Period Duration (days)</label>
                  <input
                    type='number'
                    id='periodDuration'
                    name='periodDuration'
                    value={formData.periodDuration}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder='e.g., 5'
                    min='2'
                    max='8'
                  />
                </div>
              </div>

              <div className='ch-field'>
                <label htmlFor='usualFlowLevel'>Usual Flow Level</label>
                <select
                  id='usualFlowLevel'
                  name='usualFlowLevel'
                  value={formData.usualFlowLevel}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value='Light'>Light</option>
                  <option value='Medium'>Medium</option>
                  <option value='Heavy'>Heavy</option>
                </select>
              </div>
            </fieldset>

            {/* Health Conditions Section */}
            <fieldset className='ch-fieldset'>
              <legend>Health Conditions & Diagnostics</legend>
              <p className='ch-field-hint'>Check any conditions you have been diagnosed with:</p>

              <div className='ch-checkbox-group'>
                <label className='ch-checkbox-label'>
                  <input
                    type='checkbox'
                    name='conditionsPMDD'
                    checked={formData.conditionsPMDD}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span>PMDD (Premenstrual Dysphoric Disorder)</span>
                </label>

                <label className='ch-checkbox-label'>
                  <input
                    type='checkbox'
                    name='conditionsPMS'
                    checked={formData.conditionsPMS}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span>PMS (Premenstrual Syndrome)</span>
                </label>

                <label className='ch-checkbox-label'>
                  <input
                    type='checkbox'
                    name='conditionsEndometriosis'
                    checked={formData.conditionsEndometriosis}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span>Endometriosis</span>
                </label>

                <label className='ch-checkbox-label'>
                  <input
                    type='checkbox'
                    name='conditionsPCOS'
                    checked={formData.conditionsPCOS}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span>PCOS (Polycystic Ovary Syndrome)</span>
                </label>

                <label className='ch-checkbox-label'>
                  <input
                    type='checkbox'
                    name='conditionsFibroid'
                    checked={formData.conditionsFibroid}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span>Uterine Fibroid</span>
                </label>
              </div>

              <div className='ch-field'>
                <label htmlFor='otherConditions'>Other Conditions or Diagnostics</label>
                <textarea
                  id='otherConditions'
                  name='otherConditions'
                  value={formData.otherConditions}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder='List any other medical conditions, past surgeries, or diagnostic findings...'
                  rows='4'
                />
              </div>
            </fieldset>

            {/* Medications Section */}
            <fieldset className='ch-fieldset'>
              <legend>Current Medications</legend>

              <div className='ch-field'>
                <label htmlFor='medications'>List all current medications</label>
                <textarea
                  id='medications'
                  name='medications'
                  value={formData.medications}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder='List medications, including contraception if applicable (e.g., Birth control pill, Ibuprofen, etc.)'
                  rows='4'
                />
              </div>
            </fieldset>

            {/* Additional Notes */}
            <fieldset className='ch-fieldset'>
              <legend>Additional Notes</legend>

              <div className='ch-field'>
                <label htmlFor='notes'>Any other relevant information</label>
                <textarea
                  id='notes'
                  name='notes'
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder='Add any other relevant medical history or notes...'
                  rows='4'
                />
              </div>
            </fieldset>

            {/* Action Buttons */}
            <div className='ch-actions'>
              {isEditing ? (
                <>
                  <button type='submit' className='ch-btn-save' disabled={loading}>
                    {loading ? 'Saving...' : 'Save Cycle History'}
                  </button>
                  {Object.keys(cycleData).length > 0 && (
                    <button
                      type='button'
                      className='ch-btn-cancel'
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  )}
                </>
              ) : (
                <button
                  type='button'
                  className='ch-btn-edit'
                  onClick={() => setIsEditing(true)}
                >
                  Edit Cycle History
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </Sidebar>
  )
}

export default CycleHistory
