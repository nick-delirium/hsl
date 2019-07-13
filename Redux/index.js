import { combineReducers, applyMiddleware, compose } from 'redux'
import postsReducer from '../Pages/Posts/reducer'
import urlReducer from '../Navigation/reducer'
import articleReducer from '@/Pages/Posts/components/Articles/articleReducer'
import eventReducer from '@/Pages/Posts/components/Events/eventReducer'

export const rootReducer = combineReducers({
  posts: postsReducer,
  url: urlReducer,
  article: articleReducer,
  event: eventReducer,
})
