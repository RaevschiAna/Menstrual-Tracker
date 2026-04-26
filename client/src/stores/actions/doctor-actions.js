import { SERVER } from '../../config/global'
import store from '../store'

export const getAllDoctors = async () => {
  return {
    type: 'GET_ALL_DOCTORS',
    payload: async () => {
      const state = store.getState()
      const token = state.user.data.token

      const response = await fetch(`${SERVER}/api/doctors`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch doctors')
      }

      return response.json()
    }
  }
}

export const getAssignedDoctor = async () => {
  return {
    type: 'GET_ASSIGNED_DOCTOR',
    payload: async () => {
      const state = store.getState()
      const token = state.user.data.token

      const response = await fetch(`${SERVER}/api/doctors/assigned`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch assigned doctor')
      }

      return response.json()
    }
  }
}

export const assignDoctorToPatient = async (doctorId) => {
  return {
    type: 'ASSIGN_DOCTOR',
    payload: async () => {
      const state = store.getState()
      const token = state.user.data.token

      const response = await fetch(`${SERVER}/api/doctors/assign`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ doctorId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to assign doctor')
      }

      return response.json()
    }
  }
}

export const unassignDoctor = async () => {
  return {
    type: 'UNASSIGN_DOCTOR',
    payload: async () => {
      const state = store.getState()
      const token = state.user.data.token

      const response = await fetch(`${SERVER}/api/doctors/unassign`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to unassign doctor')
      }

      return response.json()
    }
  }
}
