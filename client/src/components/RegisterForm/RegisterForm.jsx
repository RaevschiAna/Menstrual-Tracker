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
                    <path d='M12 2C12 2 12 8 12 12C12 16.41 9.31 20 6 20C2.69 20 0 16.41 0 12C0 8 0 2 0 2M18 2C18 2 18 8 18 12C18 16.41 15.31 20 12 20C8.69 20 6 16.41 6 12C6 8 6 2 6 2' fill='#E8938F'/>
                    <path d='M18 2C18 2 18 8 18 12C18 16.41 15.31 20 12 20' fill='#D4605E'/>
                    <circle cx='12' cy='12' r='3' fill='#E8938F'/>
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
