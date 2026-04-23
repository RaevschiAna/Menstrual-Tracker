import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUserSuggestions } from '../../stores/actions/user-suggestion-actions'
import Sidebar from '../Sidebar/Sidebar'

const usersSelector = state => state.userSuggestion.data
const userTypeSelector = state => state.user.data.type

const UserList = ({ onLogout }) => {
  const dispatch = useDispatch()

  const users = useSelector(usersSelector)
  const userType = useSelector(userTypeSelector)

  useEffect(() => {
    if (userType === 'admin') {
      const loadUsers = async () => {
        const action = await getAllUserSuggestions('')
        dispatch(action)
      }
      loadUsers()
    }
  }, [dispatch, userType])

  const handleRefresh = async () => {
    const action = await getAllUserSuggestions('')
    dispatch(action)
  }

  if (userType !== 'admin') return null

  return (
    <Sidebar userType={userType} onLogout={onLogout}>
      <div>
        <h1>Lista utilizatori</h1>

        <p>Total utilizatori: <strong>{users.length}</strong></p>

        <button onClick={handleRefresh}>Refresh</button>

        <ul>
          {users.map(user => (
            <li key={user.id}>
              <strong>{user.email}</strong> — {user.type}
            </li>
          ))}
        </ul>
      </div>
    </Sidebar>
  )
}

export default UserList