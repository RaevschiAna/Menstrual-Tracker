import store from '../store'
import { SERVER } from '../../config/global'

export const getAllComments = async (userId, projectId,taskId) => {
  const token = store.getState().user.data.token

  return {
    type: 'GET_ALL_COMMENTS',
    payload: async () => {
      const response = await fetch(
        `${SERVER}/api/users/${userId}/projects/${projectId}/tasks/${taskId}/comments`,
        {
          headers: {
            authorization: token
          }
        }
      )

      if (!response.ok) {
        throw response
      }

      // expected: { data, count }
      return response.json()
    }
  }
}

export const getOneComment = async (userId, projectId,taskId, commentId) => {
  const token = store.getState().user.data.token

  return {
    type: 'GET_ONE_COMMENT',
    payload: async () => {
      const response = await fetch(
        `${SERVER}/api/users/${userId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
          headers: {
            authorization: token
          }
        }
      )

      if (!response.ok) {
        throw response
      }

      // expected: single comment object
      return response.json()
    }
  }
}

export const createComment = async (userId, projectId,taskId, comment) => {
  const token = store.getState().user.data.token

  return {
    type: 'CREATE_COMMENT',
    payload: async () => {
      let response = await fetch(
        `${SERVER}/api/users/${userId}/projects/${projectId}/tasks/${taskId}/comments`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          },
          body: JSON.stringify(comment)
        }
      )

      if (!response.ok) {
        throw response
      }

      // refresh list after create
      response = await fetch(
        `${SERVER}/api/users/${userId}/projects/${projectId}/tasks/${taskId}/comments`,
        {
          headers: {
            authorization: token
          }
        }
      )

      if (!response.ok) {
        throw response
      }

      return response.json()
    }
  }
}

export const updateComment = async (userId, projectId,taskId, id, comment) => {
  const token = store.getState().user.data.token

  return {
    type: 'UPDATE_COMMENT',
    payload: async () => {
      let response = await fetch(
        `${SERVER}/api/users/${userId}/projects/${projectId}/tasks/${taskId}/comments/${id}`,
        {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          },
          body: JSON.stringify(comment)
        }
      )

      if (!response.ok) {
        throw response
      }

      // refresh list after update
      response = await fetch(
        `${SERVER}/api/users/${userId}/projects/${projectId}/tasks/${taskId}/comments`,
        {
          headers: {
            authorization: token
          }
        }
      )

      if (!response.ok) {
        throw response
      }

      return response.json()
    }
  }
}

export const deleteComment = async (userId, projectId,taskId, id) => {
  const token = store.getState().user.data.token

  return {
    type: 'DELETE_COMMENT',
    payload: async () => {
      let response = await fetch(
        `${SERVER}/api/users/${userId}/projects/${projectId}/tasks/${taskId}/comments/${id}`,
        {
          method: 'delete',
          headers: {
            authorization: token
          }
        }
      )

      if (!response.ok) {
        throw response
      }

      // refresh list after delete
      response = await fetch(
        `${SERVER}/api/users/${userId}/projects/${projectId}/tasks/${taskId}/comments`,
        {
          headers: {
            authorization: token
          }
        }
      )

      if (!response.ok) {
        throw response
      }

      return response.json()
    }
  }
}
