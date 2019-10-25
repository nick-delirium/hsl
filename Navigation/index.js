import React from 'react'
import { BackHandler, Keyboard } from 'react-native'
import Drawer from 'react-native-drawer'
import get from 'lodash/get'
import { Linking } from 'expo'
import { connect } from 'react-redux'
import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-native'
import DrawerPanel from './components/DrawerPanel'
import RouterView from '../router'
import { togglePost } from './reducer'
import { goBack } from '@/Pages/OKBK/reducer'

Sentry.init({
  dsn: 'https://5c75f18266074671887021dc70aa309b@sentry.io/1534014',
  enableInExpoDevelopment: false,
})
Sentry.setRelease(Constants.manifest.revisionId)

class RouterWithDrawer extends React.PureComponent {
  constructor(props, context) {
    super(props, context)
    this.state = {
      drawerOpen: false,
      drawerDisabled: false,
    }
  }

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    this.addLinkingListener()
    const url = await Linking.getInitialURL()
    console.log('initial url', url)
  }

  componentWillUnmount() {
    this.removeLinkingListener()
  }

  handleRedirect = (event) => {
    const { path, queryParams } = Linking.parse(event.url)
    console.log('in app redirect', path, queryParams)
  }

  addLinkingListener = () => {
    Linking.addEventListener('url', this.handleRedirect);
  }

  removeLinkingListener = () => {
    Linking.removeEventListener('url', this.handleRedirect);
  }

  handleBackPress = () => {
    const {
      history,
      location,
      isPostOpen,
      tabHistory,
      fakeHistory,
      actions,
    } = this.props
    if (isPostOpen) {
      actions.togglePost(false)
      return true
    }
    if (tabHistory.length > 1 || fakeHistory.length > 0) {
      actions.goBack()
      return true
    }
    if (location.pathname === '/') return false
    Keyboard.dismiss()
    history.goBack()
    return true
  }

  goBack = () => {
    const { history } = this.props
    Keyboard.dismiss()
    history.goBack()
  }

  closeDrawer = () => {
    this.setState({ drawerOpen: false }, () => this._drawer.close())
  }

  openDrawer = () => {
    this.setState({ drawerOpen: true }, () => this._drawer.open())
  }

  render() {
    const { location } = this.props
    const { drawerOpen, drawerDisabled } = this.state
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<DrawerPanel isOpen={drawerOpen} closeDrawer={this.closeDrawer} />}
        onOpen={() => {
          setTimeout(() => { this.setState({ drawerOpen: true }) }, 0)
        }}
        onClose={() => {
          setTimeout(() => { this.setState({ drawerOpen: false }) }, 0)
        }}
        tweenDuration={100}
        panThreshold={0.08}
        disabled={drawerDisabled}
        openDrawerOffset={() => 100}
        closedDrawerOffset={0}
        panOpenMask={0.2}
        acceptDoubleTap
        tapToClose
        captureGestures
        negotiatePan
      >
        <RouterView
          openDrawer={this.openDrawer}
          location={location.pathname}
          goBack={this.goBack}
          drawerOpen={drawerOpen}
        />
      </Drawer>
    )
  }
}

const mapStateFromProps = createStructuredSelector({
  isPostOpen: (state) => get(state, 'url.isPostOpen'),
  tabHistory: (state) => get(state, 'okbk.tabHistory', []),
  fakeHistory: (state) => get(state, 'okbk.fakeHistory'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    togglePost: (isOpen) => dispatch(togglePost(isOpen)),
    goBack: () => dispatch(goBack()),
  },
})

const RouterWithRouter = withRouter(RouterWithDrawer)

export default connect(
  mapStateFromProps,
  mapDispatchToProps,
)(RouterWithRouter)
