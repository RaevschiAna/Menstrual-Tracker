import { combineReducers } from 'redux'
import projectReducer from './project-reducer'
import userReducer from './user-reducer'
import userSuggestionReducer from './user-suggestion-reducer'
import dailyLogReducer from './daily-log-reducer'

const rootReducer = combineReducers({
  project: projectReducer,
  user: userReducer,
  userSuggestion: userSuggestionReducer,
  dailyLog: dailyLogReducer
})

export default rootReducer
  