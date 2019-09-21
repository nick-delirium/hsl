import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import Login from './Login'
import { authErrors } from './queriesErrors'
import Navbar from './components/NavBar'
import colors from './colors'

class OKBK extends PureComponent {
  render() {
    const {
      isLoggedIn,
      isLoading,
      account,
      error,
    } = this.props
    if (isLoading) return <Text>loading</Text>
    if ((!isLoggedIn && !isLoading) || error) {
      return (
        <Login error={get(authErrors, error)} />
      )
    }
    return (
      <View style={styles.main}>
        {account && (
          <View>
            <Text>Succsess logged in!</Text>
          </View>
        )}
        <Navbar />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.bg,
    flex: 1,
  },
})

const mapStateToProps = createStructuredSelector({
  isLoggedIn: (state) => get(state, 'okbk.isLoggedIn'),
  isLoading: (state) => get(state, 'okbk.isLoading'),
  account: (state) => get(state, 'okbk.account'),
  error: (state) => get(state, 'okbk.error'),
  currentTab: (state) => get(state, 'okbk.currentTab'),
})

export default connect(mapStateToProps)(OKBK)
