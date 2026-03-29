const initialState = {
  data: [],
  loading: false,
  error: null
}

export default function dailyLogReducer(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_DAILY_LOG_PENDING':
    case 'GET_DAILY_LOGS_PENDING':
      return { ...state, loading: true, error: null }

    case 'CREATE_DAILY_LOG_FULFILLED':
      return {
        ...state,
        loading: false,
        error: null,
        data: [action.payload, ...state.data]
      }

    case 'GET_DAILY_LOGS_FULFILLED':
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload
      }

    case 'CREATE_DAILY_LOG_REJECTED':
    case 'GET_DAILY_LOGS_REJECTED':
      return {
        ...state,
        loading: false,
        error: action.payload?.message || 'Daily log error'
      }

    default:
      return state
  }
}
