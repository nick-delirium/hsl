import React, { PureComponent } from 'react'
import {
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import Login from './Login'

class OKBK extends PureComponent {
  render() {
    const { isLoggedIn } = this.props
    if (!isLoggedIn) return <Login />

    return (
      <View>
        <Text> hello </Text>
      </View>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isLoggedIn: (state) => get(state, 'okbk.isLoggedIn'),
  currentTab: (state) => get(state, 'okbk.currentTab'),
})

export default connect(mapStateToProps)(OKBK)
