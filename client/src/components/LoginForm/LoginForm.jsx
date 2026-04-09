import './LoginForm.css'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../../stores/actions/user-actions'

// selectors
const userDataSelector = state => state.user.data
const userLoadingSelector = state => state.user.loading
const userErrorSelector = state => state.user.error

const LoginForm = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const userData = useSelector(userDataSelector)
  const loading = useSelector(userLoadingSelector)
  const error = useSelector(userErrorSelector)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')

  const isAuthenticated = !!userData.token

  const handleLoginClick = async () => {
    if (!email.trim() || !password) {
      setFormError('Please enter email and password')
      return
    }

    setFormError('')
    const action = await login(email.trim(), password)
    dispatch(action)
  }
  
  const handleRegisterClick = async () => {
    navigate('/register')
  }

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/'
      navigate(from)
    }
  }, [isAuthenticated, location.state, navigate])

  return (
    <div className='login-form'>
      <div className='login-header'>
        <svg className='login-logo' viewBox='0 0 24 24'>
          <defs>
            <linearGradient id='tearDropGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
              <stop offset='0%' style={{ stopColor: '#E8938F', stopOpacity: 1 }} />
              <stop offset='100%' style={{ stopColor: '#D4605E', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d='M12 2C12 2 18 8 18 14C18 19.52 15.31 22 12 22C8.69 22 6 19.52 6 14C6 8 12 2 12 2Z' fill='url(#tearDropGradient)'/>
        </svg>
        <h2>Menstrual Tracker</h2>
      </div>
      <div className='login-card'>
        <h1>Login Screen</h1>
        <form className='form-container' onSubmit={(e) => {e.preventDefault(); handleLoginClick();}}>
          <input
            type='email'
            placeholder='name@example.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className='remember-me'>
            <input type='checkbox' id='remember' />
            <label htmlFor='remember'>Remember me</label>
          </div>
          <button onClick={handleLoginClick} disabled={loading} className='login-btn'>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          {(formError || error) && (
            <div className='error'>
              {formError || 'Login failed'}
            </div>
          )}
        </form>
        <div className='login-links'>
          <span>Don't have an account? <button className='link-btn' onClick={handleRegisterClick}>Sign Up</button></span>
          <button className='link-btn'>Forgot password?</button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
