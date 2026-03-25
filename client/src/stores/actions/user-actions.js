import store from '../store'
import { SERVER } from '../../config/global'

export const login = async (email, password) => {
  return {
    type: 'LOGIN',
    payload: async () => {
      const response = await fetch(`${SERVER}/auth/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      // original: this.data = await response.json()
      return response.json()
    }
  }
}

export const logout = async () => {
  const token = store.getState().user.data.token

  return {
    type: 'LOGOUT',
    payload: async () => {
      const response = await fetch(`${SERVER}/auth/logout`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Logout failed')
      }

      return true
    }
  }
}

export const register = async (email, password, firstName, lastName, dateOfBirth, height, weight) => {
  return {
    type: 'REGISTER',
    payload: async () => {
      const response = await fetch(`${SERVER}/auth/register`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          dateOfBirth,
          height,
          weight
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      // original: this.data = await response.json()
      return response.json()
    }
  }
}