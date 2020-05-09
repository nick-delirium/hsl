import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './Redux'
import logger from './Redux/logger'

const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

const enhancer = composeEnhancers(
  applyMiddleware(thunk, logger),
)

const configureStore = () => ({
  ...createStore(rootReducer, enhancer),
})

export default configureStore
