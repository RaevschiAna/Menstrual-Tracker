import { combineReducers } from 'redux'
import userReducer from './user-reducer'
import userSuggestionReducer from './user-suggestion-reducer'
import dailyLogReducer from './daily-log-reducer'
import cycleReducer from './cycle-reducer'
import doctorReducer from './doctor-reducer'

const rootReducer = combineReducers({
  user: userReducer,
  userSuggestion: userSuggestionReducer,
  dailyLog: dailyLogReducer,
  cycle: cycleReducer,
  doctor: doctorReducer
})

export default rootReducer
  