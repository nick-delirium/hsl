import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import rootReducer from './Redux'
import logger from './Redux/logger'

const configureStore = () => ({ ...createStore(rootReducer, {}, applyMiddleware(thunk, logger)) })

export default configureStore
