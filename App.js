import React from 'react'
import { StyleSheet, View, StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import createStore from './Redux'
import { NativeRouter } from 'react-router-native'
import RouterWithDrawer from './Navigation'

const store = createStore();

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
