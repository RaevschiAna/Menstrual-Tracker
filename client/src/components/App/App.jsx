import './App.css'
import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import AuthGuard from '../AuthGuard'
import LoginForm from '../LoginForm'
import ProjectList from '../ProjectList'
import ProjectForm from '../ProjectForm/ProjectForm'
import TaskList from '../TaskList'
import TaskForm from '../TaskForm'
import TaskDetails from '../TaskDetails'
import Dashboard from '../Dashboard'
import ErrorDisplay from '../ErrorDisplay'
import CommentList from '../CommentList'
import CommentForm from '../CommentForm' 
import RegisterForm from '../RegisterForm'
import UserList from '../UserList'

import { logout } from '../../stores/actions/user-actions'

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
            path='/projects'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <ProjectList />
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
            path='/projects/:pid/tasks'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <TaskList />
              </AuthGuard>
            }
          />
          <Route
            path='/projects/:pid/tasks/new'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <TaskForm />
              </AuthGuard>
            }
          />
          <Route
            path='/projects/:pid/tasks/:tid'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <TaskDetails />
              </AuthGuard>
            }
          />
          <Route
            path='/projects/:pid/tasks/:tid/comments'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <CommentList />
              </AuthGuard>
            }
          />
          <Route
            path='/projects/:pid/tasks/:tid/comments/new'
            element={
              <AuthGuard isAuthenticated={isAuthenticated}>
                <CommentForm />
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
