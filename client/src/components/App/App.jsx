import './App.css'
import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import AuthGuard from '../AuthGuard'
import LoginForm from '../LoginForm'
import Dashboard from '../Dashboard'
import DailyLogForm from '../DailyLogForm'
import DailyLogList from '../DailyLogList'
import CycleHistory from '../CycleHistory'
import ErrorDisplay from '../ErrorDisplay'
import RegisterForm from '../RegisterForm'
import UserList from '../UserList'
import Doctors from '../Doctors'

import { logout } from '../../stores/actions/user-actions'
import Sidebar from '../Sidebar'

// selectors
const userDataSelector = state => state.user.data
const userTypeSelector = state => state.user.data.type

const App = () => {
  const dispatch = useDispatch()
  const userData = useSelector(userDataSelector)
  const userType = useSelector(userTypeSelector)

  const isAuthenticated = !!userData.token

  const handleLogout = async () => {
    const action = await logout()
    dispatch(action)
  }

  return (
    <div className='app'>
      <ErrorDisplay />

      <Router>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />

          <Route
            path='/'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <Dashboard onLogout={isAuthenticated ? handleLogout : undefined} />
              </AuthGuard>
            }
          />

          <Route
            path='/daily-log'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <DailyLogList onLogout={handleLogout} />
              </AuthGuard>
            }
          />

          <Route
            path='/daily-log/new'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <DailyLogForm onLogout={handleLogout} />
              </AuthGuard>
            }
          />

          <Route
            path='/cycle-history'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <CycleHistory onLogout={handleLogout} />
              </AuthGuard>
            }
          />

          <Route
            path='/doctors'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <Sidebar userType={userType} onLogout={handleLogout}>
                  <Doctors />
                </Sidebar>
              </AuthGuard>
            }
          />

          <Route
            path='/users'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <UserList onLogout={handleLogout} />
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
