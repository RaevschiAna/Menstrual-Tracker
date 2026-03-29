import './App.css'
import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import AuthGuard from '../AuthGuard'
import LoginForm from '../LoginForm'
import ProjectList from '../ProjectList'
import ProjectForm from '../ProjectForm/ProjectForm'
import Dashboard from '../Dashboard'
import DailyLogForm from '../DailyLogForm'
import DailyLogList from '../DailyLogList'
import ErrorDisplay from '../ErrorDisplay'
import RegisterForm from '../RegisterForm'
import UserList from '../UserList'

import { logout } from '../../stores/actions/user-actions'
import Sidebar from '../Sidebar'
import Calendar from 'react-calendar'

// selectors
const userDataSelector = state => state.user.data

const App = () => {
  const dispatch = useDispatch()
  const userData = useSelector(userDataSelector)

  const isAuthenticated = !!userData.token

  const handleLogout = async () => {
    const action = await logout()
    dispatch(action)
  }

  return (
    <div className='app'>
      {isAuthenticated && (
        <div className='app-header'>
          <div>
            <h5>Welcome, {userData.email}</h5>
          </div>
          <div>
            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}

      <ErrorDisplay />

      <Router>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />

          <Route
            path='/'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <Dashboard />
              </AuthGuard>
            }
          />

          <Route
            path='/daily-log'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <DailyLogList />
              </AuthGuard>
            }
          />

          <Route
            path='/daily-log/new'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <DailyLogForm />
              </AuthGuard>
            }
          />

          <Route
            path='/projects'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <Calendar />
              </AuthGuard>
            }
          />

          <Route
            path='/projects/new'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <ProjectForm />
              </AuthGuard>
            }
          />
          <Route
            path='/users'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <UserList />
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
