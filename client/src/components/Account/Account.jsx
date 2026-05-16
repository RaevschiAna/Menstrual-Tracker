import React, { useState, useRef } from 'react'
import './Account.css'
import { useSelector, useDispatch } from 'react-redux'
import Sidebar from '../Sidebar/Sidebar'
import { updateProfile, uploadProfilePicture } from '../../stores/actions/profile-actions'
import { SERVER } from '../../config/global'

const userDataSelector = state => state.user.data
const userTypeSelector = state => state.user.data.type

const Account = ({ onLogout }) => {
  const dispatch = useDispatch()
  const userData = useSelector(userDataSelector)
  const userType = useSelector(userTypeSelector)
  const fileInputRef = useRef(null)

  const [firstName, setFirstName] = useState(userData.firstName || '')
  const [lastName, setLastName] = useState(userData.lastName || '')
  const [height, setHeight] = useState(userData.height || '')
  const [weight, setWeight] = useState(userData.weight || '')

  const [saveStatus, setSaveStatus] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const avatarUrl = previewUrl || (userData.profilePicture
    ? `${SERVER}/uploads/${userData.profilePicture}`
    : null)

  const getInitials = () => {
    const first = firstName?.[0] || userData.firstName?.[0] || ''
    const last = lastName?.[0] || userData.lastName?.[0] || ''
    return (first + last).toUpperCase() || '?'
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))
    setUploadStatus(null)
    setIsUploading(true)

    try {
      const action = await uploadProfilePicture(file)
      dispatch(action)
      setUploadStatus({ type: 'success', message: 'Profile picture updated.' })
    } catch (err) {
      setUploadStatus({ type: 'error', message: 'Failed to upload picture.' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaveStatus(null)
    setIsSaving(true)

    try {
      const data = { firstName, lastName }
      if (userType === 'patient') {
        if (height !== '' && height !== null) data.height = height
        if (weight !== '' && weight !== null) data.weight = weight
      }
      const action = await updateProfile(data)
      dispatch(action)
      setSaveStatus({ type: 'success', message: 'Profile saved successfully.' })
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message || 'Failed to save profile.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Sidebar userType={userType} onLogout={onLogout}>
      <div className="account-page">
        <h1 className="account-title">My Account</h1>

        <div className="account-card">
          <section className="account-section">
            <h2 className="account-section-title">Profile Picture</h2>
            <div className="avatar-area">
              <div className="avatar-preview">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="avatar-img" />
                ) : (
                  <span className="avatar-initials">{getInitials()}</span>
                )}
              </div>
              <div className="avatar-controls">
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Change Picture'}
                </button>
                <p className="avatar-hint">JPG, PNG, GIF or WebP · Max 5 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="file-input-hidden"
                />
                {uploadStatus && (
                  <p className={`status-msg ${uploadStatus.type}`}>{uploadStatus.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="account-section">
            <h2 className="account-section-title">Personal Information</h2>
            <form className="account-form" onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {userType === 'patient' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      min="50"
                      max="300"
                    />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      min="10"
                      max="500"
                    />
                  </div>
                </div>
              )}

              <div className="form-footer">
                {saveStatus && (
                  <p className={`status-msg ${saveStatus.type}`}>{saveStatus.message}</p>
                )}
                <button type="submit" className="save-btn" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </section>

          <section className="account-section account-info-section">
            <h2 className="account-section-title">Account Info</h2>
            <div className="account-info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{userData.email}</span>
            </div>
            <div className="account-info-row">
              <span className="info-label">Account type</span>
              <span className={`info-badge ${userType}`}>{userType}</span>
            </div>
          </section>
        </div>
      </div>
    </Sidebar>
  )
}

export default Account
