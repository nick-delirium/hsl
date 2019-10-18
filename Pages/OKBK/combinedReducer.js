import { combineReducers } from 'redux'
import rootReducer from './reducer'
import loginReducer from './Login/reducer'
import peopleReducer from './People/reducer'
import clubsReducer from './Clubs/reducer'

const combinedReducer = combineReducers({
  root: rootReducer,
  users: peopleReducer,
  clubs: clubsReducer,
  login: loginReducer,
})

export default combinedReducer
