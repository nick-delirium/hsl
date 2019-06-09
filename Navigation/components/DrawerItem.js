import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-native'
import { changeLocation } from '../reducer'

class DrawerItem extends React.Component {
  constructor(props) {
    super(props)
  }

  onItemPress = (path) => {
    this.props.history.push(path)
    this.props.changeLoc(path)
    this.props.closeDrawer()
  }

  isButtonActive = (url) => {
    const { path } = this.props
    return path === url
  }

  render() {
    const { href, text } = this.props
    const isActive = this.isButtonActive(href)

    return (
      <TouchableOpacity
        onPress={() => this.onItemPress(href)}
        style={[
          styles.button,
          isActive && styles.activeButton
        ]}
      >
        <Text style={styles.text}>
          {text}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingLeft: 40,
  },
  activeButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
})

const mapStateToProps = createStructuredSelector({
  path: (state) => get(state, 'url.path'),
})
const mapDispatchToProps = (dispatch) => ({
  changeLoc: (path) => dispatch(changeLocation(path))
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(DrawerItem)
