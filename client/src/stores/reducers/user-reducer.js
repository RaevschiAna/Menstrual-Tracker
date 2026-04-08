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
        data: {}                // logged out
      }

    case `LOGIN_REJECTED`:
    case `LOGOUT_REJECTED`:
    case `REGISTER_REJECTED`:
      return {
        ...state,
        loading: false,
        error: action.payload?.message || action.error || 'User auth error'
      }

    default:
      return state
  }
}
