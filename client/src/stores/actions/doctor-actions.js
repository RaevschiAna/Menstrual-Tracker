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
        try {
          const errorData = await response.json()
          throw new Error(errorData.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`Failed to fetch doctors: ${response.status} ${response.statusText}`)
        }
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
      const patientId = state.user.data.id

      const response = await fetch(`${SERVER}/api/doctors/assign`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          doctorId,
          patientId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to assign doctor')
      }

      return response.json()
    }
  }
}
