import { combineReducers } from 'redux'
import postsReducer from '../Pages/Posts/reducer'
import urlReducer from '../Navigation/reducer'
import articleReducer from '@/Pages/Posts/components/Articles/articleReducer'
import eventReducer from '@/Pages/Posts/components/Events/eventReducer'
import searchReducer from '@/Pages/Search/reducer'
import placesReducer from '@/Pages/Places/reducer'

export const rootReducer = combineReducers({
  posts: postsReducer,
  url: urlReducer,
  article: articleReducer,
  event: eventReducer,
  search: searchReducer,
  locations: placesReducer,
})
