import { combineReducers, applyMiddleware, compose } from 'redux'
import postsReducer from '../Pages/AllPosts/reducer'



export const rootReducer = combineReducers({
  posts: postsReducer,
})
