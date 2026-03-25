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
            <div className='form-container'>
                <h1>Create account</h1>
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
                <input
                    type='text'
                    placeholder='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={handleRegisterClick} disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                {(formError || error) && (
                    <div className='error'>
                        {formError || error}
                    </div>
                )}
            </div>
        </div>
    )
}

export default RegisterForm
