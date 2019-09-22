/* eslint-disable react/prefer-stateless-function */
import React from 'react'
import { Provider } from 'react-redux'
import AppIndex from './index'
import configureStore from './configureStore'

const store = configureStore()

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppIndex />
      </Provider>
    )
  }
}
