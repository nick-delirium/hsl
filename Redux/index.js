import { combineReducers, applyMiddleware, compose } from 'redux'
import postsReducer from '../Pages/News/reducer'



export const rootReducer = combineReducers({
  posts: postsReducer,
})
