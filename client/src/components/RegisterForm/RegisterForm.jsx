import './RegisterForm.css'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { register } from '../../stores/actions/user-actions'

// selectors
const userDataSelector = state => state.user.data
const userLoadingSelector = state => state.user.loading
const userErrorSelector = state => state.user.error

const RegisterForm = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const userData = useSelector(userDataSelector)
    const loading = useSelector(userLoadingSelector)
    const error = useSelector(userErrorSelector)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')



    const isAuthenticated = !!userData.token
    const [formError, setFormError] = useState('')
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const handleRegisterClick = async () => {
        if (!email.trim() || !password || !firstName.trim() || !lastName.trim() || !dateOfBirth || !height || !weight) {
            setFormError('Please fill in all required fields')
            return
        }

        setFormError('')
        setHasSubmitted(true)
        const action = await register(email.trim(), password, firstName.trim(), lastName.trim(), dateOfBirth, Number(height), Number(weight))
        dispatch(action)
    }

    useEffect(() => {
        if (hasSubmitted && !loading && !error) {
            navigate('/login')
        }
    }, [hasSubmitted, loading, error, navigate])

    useEffect(() => {
        if (error) {
            setHasSubmitted(false)
        }
    }, [error])


    return (
        <div className='register-form'>
            <div className='register-header'>
                <svg className='register-logo' viewBox='0 0 24 24'>
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
            <div className='register-card'>
                <h1>Create Account</h1>
                <form className='form-container' onSubmit={(e) => {e.preventDefault(); handleRegisterClick();}}>
                    <input
                        type='text'
                        placeholder='First Name'
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Last Name'
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
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
                    <input
                        type='date'
                        placeholder='Date of Birth'
                        value={dateOfBirth}
                        onChange={e => setDateOfBirth(e.target.value)}
                    />
                    <input
                        type='number'
                        placeholder='Height (cm)'
                        value={height}
                        onChange={e => setHeight(e.target.value)}
                    />
                    <input
                        type='number'
                        placeholder='Weight (kg)'
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                    />
                    <button onClick={handleRegisterClick} disabled={loading} className='register-btn'>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                    {(formError || error) && (
                        <div className='error'>
                            {formError || error}
                        </div>
                    )}
                </form>
                <div className='register-links'>
                    <span>Already have an account? <button className='link-btn' onClick={() => navigate('/login')}>Log In</button></span>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
