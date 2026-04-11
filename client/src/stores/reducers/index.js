import { combineReducers } from 'redux'
import userReducer from './user-reducer'
import userSuggestionReducer from './user-suggestion-reducer'
import dailyLogReducer from './daily-log-reducer'
import cycleReducer from './cycle-reducer'

const rootReducer = combineReducers({
  user: userReducer,
  userSuggestion: userSuggestionReducer,
  dailyLog: dailyLogReducer,
  cycle: cycleReducer
})

export default rootReducer
  