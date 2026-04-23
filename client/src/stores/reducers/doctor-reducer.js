const initialState = {
  data: [],
  loading: false,
  error: null,
  assigned: []
}

export default function doctorReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_ALL_DOCTORS_PENDING':
    case 'ASSIGN_DOCTOR_PENDING':
      return { ...state, loading: true, error: null }

    case 'GET_ALL_DOCTORS_FULFILLED':
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload
      }

    case 'ASSIGN_DOCTOR_FULFILLED':
      return {
        ...state,
        loading: false,
        error: null,
        assigned: [...state.assigned, action.payload.doctor]
      }

    case 'GET_ALL_DOCTORS_REJECTED':
    case 'ASSIGN_DOCTOR_REJECTED':
      return {
        ...state,
        loading: false,
        error: action.payload?.message || 'Doctor error'
      }

    default:
      return state
  }
}
