const getInitialState = () => {
  try {
    const savedUser = localStorage.getItem('userData')
    return {
      data: savedUser ? JSON.parse(savedUser) : {},
      loading: false,
      error: null
    }
  } catch (e) {
    return {
      data: {},
      loading: false,
      error: null
    }
  }
}

const initialState = getInitialState()

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case `LOGIN_PENDING`:
    case `LOGOUT_PENDING`:
    case `REGISTER_PENDING`:
      return {
        ...state,
        loading: true,
        error: null
      }

    case `LOGIN_FULFILLED`:
    case `REGISTER_FULFILLED`:
      localStorage.setItem('userData', JSON.stringify(action.payload))
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload    // token, id, etc.
      }

    case `LOGOUT_FULFILLED`:
      localStorage.removeItem('userData')
      return {
        ...state,
        loading: false,
        error: null,
        data: {}
      }

    case `LOGOUT_REJECTED`:
      localStorage.removeItem('userData')
      return {
        ...state,
        loading: false,
        error: null,
        data: {}
      }

    case `LOGIN_REJECTED`:
    case `REGISTER_REJECTED`:
      return {
        ...state,
        loading: false,
        error: action.payload?.message || action.error || 'User auth error'
      }

    case `GET_PROFILE_PENDING`:
    case `UPDATE_PROFILE_PENDING`:
    case `UPLOAD_PROFILE_PICTURE_PENDING`:
      return {
        ...state,
        loading: true,
        error: null
      }

    case `GET_PROFILE_FULFILLED`:
    case `UPDATE_PROFILE_FULFILLED`: {
      const updated = { ...state.data, ...action.payload }
      localStorage.setItem('userData', JSON.stringify(updated))
      return {
        ...state,
        loading: false,
        error: null,
        data: updated
      }
    }

    case `UPLOAD_PROFILE_PICTURE_FULFILLED`: {
      const updated = { ...state.data, profilePicture: action.payload.profilePicture }
      localStorage.setItem('userData', JSON.stringify(updated))
      return {
        ...state,
        loading: false,
        error: null,
        data: updated
      }
    }

    case `GET_PROFILE_REJECTED`:
    case `UPDATE_PROFILE_REJECTED`:
    case `UPLOAD_PROFILE_PICTURE_REJECTED`:
      return {
        ...state,
        loading: false,
        error: action.payload?.message || action.error || 'Profile error'
      }

    default:
      return state
  }
}
