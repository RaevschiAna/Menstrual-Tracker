import { combineReducers } from 'redux'
import projectReducer from './project-reducer'
import taskReducer from './task-reducer'
import userReducer from './user-reducer'
import userSuggestionReducer from './user-suggestion-reducer'
import commentReducer from './comment-reducer'

const rootReducer = combineReducers({
  project: projectReducer,
  task: taskReducer,
  user: userReducer,
  userSuggestion: userSuggestionReducer,
  comment:commentReducer
})

export default rootReducer
  