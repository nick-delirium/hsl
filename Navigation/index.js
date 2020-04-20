/* eslint-disable no-async-promise-executor */
import React from 'react'
import { BackHandler, Keyboard, AsyncStorage } from 'react-native'
import Drawer from 'react-native-drawer'
import get from 'lodash/get'
import { Linking, Notifications } from 'expo'
import { connect } from 'react-redux'
import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-native'
import { goBack } from '@/Pages/OKBK/reducer'
import { client as gqlClient, subscribeToPush } from '@/Pages/OKBK/gqlQueries'
import api from '@/api'
import { getPosts } from '@/Pages/Posts/reducer'
import { setData as setArticle } from '@/Pages/Posts/components/Articles/articleReducer'
import { setEvent } from '@/Pages/Posts/components/Events/eventReducer'
import findPost from '@/common/findPost'
import { setUpAnalytics, events } from '@/analytics'
import registerForPushNotificationsAsync, { dismissNotifications, createAndroidNotificationChanel } from '../setUpNotifications'
import { togglePost, changeLocation } from './reducer'
import RouterView from '../router'
import DrawerPanel from './components/DrawerPanel'

Sentry.init({
  dsn: 'https://5c75f18266074671887021dc70aa309b@sentry.io/1534014',
  enableInExpoDevelopment: false,
})
Sentry.setRelease(Constants.manifest.revisionId)

const rand = () => Math.random().toString(36).substr(2)
const userToken = () => rand() + rand()

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

    /* ANALYTICS */
    const userIdToken = await this.getUserToken()

    try {
      const OKBKLogin = await AsyncStorage.getItem('account')
      const userId = get(JSON.parse(OKBKLogin), 'user.id')
      setUpAnalytics(userIdToken, { OKBKLogin: userId })
      events.openApp(userIdToken, userId)
    } catch (e) {
      setUpAnalytics(userIdToken)
      events.openApp(userIdToken)
    }
    /* ANALYTICS */

    try {
      const url = await Linking.getInitialURL()
      const index = url.indexOf('redirect')
      if (index !== -1) {
        const type = url.slice(index + 14)
        const [postType, id] = type.split('Z')
        this.findRedirectToArticle(id, postType)
      }
    } catch (e) {
      throw new Error(e)
    }

    dismissNotifications()
    createAndroidNotificationChanel()

    registerForPushNotificationsAsync()
      .then(async (token) => {
        await gqlClient.query({
          query: subscribeToPush,
          variables: {
            userId: userIdToken,
            token,
          },
        })
      })
      .catch((e) => {
        throw new Error(e)
      })

    this._notificationSubscription = Notifications.addListener(this._handleNotification)
  }

  componentWillUnmount() {
    this.removeLinkingListener()
  }

  getUserToken = () => new Promise(async (resolve) => {
    const possibleToken = userToken()
    try {
      const result = await AsyncStorage.getItem('userId')
      console.log('hello', result)
      resolve(result)
    } catch (e) {
      await AsyncStorage.setItem('userId', possibleToken)
      resolve(possibleToken)
    }
  })

  _handleNotification = (notification) => {
    const isRedirectPush = Boolean(notification.data.id)
    if (isRedirectPush) {
      this.closeDrawer()
      const { id, type } = notification.data
      console.log(notification.data)
      this.findRedirectToArticle(id, type, true)
    }
  }

  findRedirectToArticle = (id, type, fromPush) => {
    const { history, actions } = this.props
    const isEvent = type === 'event'
    const route = isEvent ? '/events' : '/'
    const setAction = isEvent ? actions.setEvent : actions.setArticle
    console.log('fromPush', fromPush)
    events.openPost({ id, source: fromPush ? 'push' : 'link' })
    history.push(route)
    actions.changeLocation(route)
    const fetchUrl = api.getPost(id, isEvent)
    findPost(type, fetchUrl, setAction, actions.togglePost)
  }

  handleRedirect = (event) => {
    // dev:  'https://hansanglab.com/2019/10/26/familiya-nam/?expoLink=exp://192.168.1.139:19000/--/redirect?type=articleZ9043'
    // prod: 'https://hansanglab.com/2019/10/26/familiya-nam/?expoLink=hslapp://redirect?type=articleZ6625'
    const index = event.url.indexOf('redirect')
    if (index !== -1) {
      this.closeDrawer()
      const { actions } = this.props
      const type = event.url.slice(index + 14)
      const [postType, id] = type.split('Z')
      actions.fetchPosts(undefined, true)
      this.findRedirectToArticle(id, postType)
    }
  }

  addLinkingListener = () => {
    Linking.addEventListener('url', this.handleRedirect)
  }

  removeLinkingListener = () => {
    Linking.removeEventListener('url', this.handleRedirect)
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
    events.closeDrawer()
    this.setState({ drawerOpen: false }, () => this._drawer.close())
  }

  openDrawer = () => {
    events.openDrawer()
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
  path: (state) => get(state, 'url.path'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    togglePost: (isOpen, type) => dispatch(togglePost(isOpen, type)),
    goBack: () => dispatch(goBack()),
    setArticle: (article) => dispatch(setArticle(article)),
    setEvent: (event) => dispatch(setEvent(event)),
    fetchPosts: (limit, isRefresh) => dispatch(getPosts(limit, isRefresh)),
    changeLocation: (path) => dispatch(changeLocation(path)),
  },
})

const RouterWithRouter = withRouter(RouterWithDrawer)

export default connect(
  mapStateFromProps,
  mapDispatchToProps,
)(RouterWithRouter)
