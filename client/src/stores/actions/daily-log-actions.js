import store from '../store'
import { SERVER } from '../../config/global'

export const createDailyLog = async (logData) => {
  const token = store.getState().user.data.token

  return {
    type: 'CREATE_DAILY_LOG',
    payload: async () => {
      const response = await fetch(`${SERVER}/api/daily-logs`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(logData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create daily log')
      }

      return response.json()
    }
  }
}

export const getDailyLogs = async () => {
  const token = store.getState().user.data.token

  return {
    type: 'GET_DAILY_LOGS',
    payload: async () => {
      const response = await fetch(`${SERVER}/api/daily-logs`, {
        method: 'get',
        headers: {
          'Authorization': token
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch daily logs')
      }

      return response.json()
    }
  }
}
