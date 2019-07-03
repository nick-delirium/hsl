import { combineReducers, applyMiddleware, compose } from 'redux'
import postsReducer from '../Pages/AllPosts/reducer'
import urlReducer from '../Navigation/reducer'
import articleReducer from './articleReducer'
import eventReducer from './eventReducer'

export const rootReducer = combineReducers({
  posts: postsReducer,
  url: urlReducer,
  article: articleReducer,
  event: eventReducer,
})
