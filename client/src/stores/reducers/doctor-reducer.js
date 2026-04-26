const initialState = {
  data: [],
  loading: false,
  error: null,
  assigned: null  // single doctor object or null
}

export default function doctorReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_ALL_DOCTORS_PENDING':
    case 'GET_ASSIGNED_DOCTOR_PENDING':
    case 'ASSIGN_DOCTOR_PENDING':
    case 'UNASSIGN_DOCTOR_PENDING':
      return { ...state, loading: true, error: null }

    case 'GET_ALL_DOCTORS_FULFILLED':
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload
      }

    case 'GET_ASSIGNED_DOCTOR_FULFILLED':
      return {
        ...state,
        loading: false,
        error: null,
        assigned: action.payload.doctor  // null or a doctor object
      }

    case 'ASSIGN_DOCTOR_FULFILLED':
      return {
        ...state,
        loading: false,
        error: null,
        assigned: action.payload.doctor
      }

    case 'UNASSIGN_DOCTOR_FULFILLED':
      return {
        ...state,
        loading: false,
        error: null,
        assigned: null
      }

    case 'GET_ALL_DOCTORS_REJECTED':
    case 'GET_ASSIGNED_DOCTOR_REJECTED':
    case 'ASSIGN_DOCTOR_REJECTED':
    case 'UNASSIGN_DOCTOR_REJECTED':
      return {
        ...state,
        loading: false,
        error: action.payload?.message || 'Doctor error'
      }

    default:
      return state
  }
}
