import React from 'react'
import { 
  StyleSheet, 
  View, 
  StatusBar,
  AppRegistry,
} from 'react-native'
import { Provider } from 'react-redux'
import { NativeRouter } from 'react-router-native'
import RouterWithDrawer from './Navigation'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import configureStore from './configureStore'

const store = configureStore()

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <View style={styles.container}>
            <StatusBar barStyle='light-content' />
            <RouterWithDrawer />
          </View>
        </NativeRouter>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})
