const initialState = {
  data: {},
  loading: false,
  error: null
}

export default function cycleReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_CYCLE_HISTORY_PENDING':
    case 'SAVE_CYCLE_HISTORY_PENDING':
    case 'UPDATE_CYCLE_HISTORY_PENDING':
      return {
        ...state,
        loading: true,
        error: null
      }

    case 'GET_CYCLE_HISTORY_FULFILLED':
    case 'SAVE_CYCLE_HISTORY_FULFILLED':
    case 'UPDATE_CYCLE_HISTORY_FULFILLED':
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload
      }

    case 'GET_CYCLE_HISTORY_REJECTED':
    case 'SAVE_CYCLE_HISTORY_REJECTED':
    case 'UPDATE_CYCLE_HISTORY_REJECTED':
      return {
        ...state,
        loading: false,
        error: action.payload?.message || action.error || 'Cycle history error'
      }

    default:
      return state
  }
}
