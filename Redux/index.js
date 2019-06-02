import { combineReducers, createStore, applyMiddleware, compose } from 'redux'

const initialState = {
  foo: 'bar'
}

function reducer(state = initialState, action) {
  switch (action.type) {
    default: 
      return state
  }
}

export default () => {
  const rootReducer = combineReducers({
    main: reducer
  })

  return createStore(rootReducer)
}
