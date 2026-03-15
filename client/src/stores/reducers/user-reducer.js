const initialState = {
  data: {},
  loading: false,
  error: null
}

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
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload    // token, id, etc.
      }

    case `LOGOUT_FULFILLED`:
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
        error: action.payload || action.error || 'User auth error'
      }

    default:
      return state
  }
}
