import { combineReducers, applyMiddleware, compose } from 'redux'
import postsReducer from '../Pages/AllPosts/reducer'
import urlReducer from '../Navigation/reducer'


export const rootReducer = combineReducers({
  posts: postsReducer,
  url: urlReducer,
})
