import store from '../store'
import { SERVER } from '../../config/global'

export const getCycleHistory = async () => {
  const token = store.getState().user.data.token

  return {
    type: 'GET_CYCLE_HISTORY',
    payload: async () => {
      const response = await fetch(`${SERVER}/api/cycle-history`, {
        method: 'get',
        headers: {
          'Authorization': token
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch cycle history')
      }

      return response.json()
    }
  }
}

export const saveCycleHistory = async (cycleData) => {
  const token = store.getState().user.data.token

  return {
    type: 'SAVE_CYCLE_HISTORY',
    payload: async () => {
      const response = await fetch(`${SERVER}/api/cycle-history`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(cycleData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save cycle history')
      }

      return response.json()
    }
  }
}

export const updateCycleHistory = async (cycleData) => {
  const token = store.getState().user.data.token

  return {
    type: 'UPDATE_CYCLE_HISTORY',
    payload: async () => {
      const response = await fetch(`${SERVER}/api/cycle-history`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(cycleData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update cycle history')
      }

      return response.json()
    }
  }
}
