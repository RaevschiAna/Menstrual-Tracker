import store from '../store'
import { SERVER } from '../../config/global'

export const getProfile = async () => {
  const token = store.getState().user.data.token

  return {
    type: 'GET_PROFILE',
    payload: async () => {
      const response = await fetch(`${SERVER}/api/profile`, {
        method: 'get',
        headers: {
          Authorization: token
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch profile')
      }

      return response.json()
    }
  }
}

export const updateProfile = async (data) => {
  const token = store.getState().user.data.token

  return {
    type: 'UPDATE_PROFILE',
    payload: async () => {
      const response = await fetch(`${SERVER}/api/profile`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      return response.json()
    }
  }
}

export const uploadProfilePicture = async (file) => {
  const token = store.getState().user.data.token

  return {
    type: 'UPLOAD_PROFILE_PICTURE',
    payload: async () => {
      const formData = new FormData()
      formData.append('picture', file)

      const response = await fetch(`${SERVER}/api/profile/picture`, {
        method: 'post',
        headers: {
          Authorization: token
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to upload picture')
      }

      return response.json()
    }
  }
}
