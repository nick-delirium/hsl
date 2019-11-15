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
import DrawerPanel from './components/DrawerPanel'
import RouterView from '../router'
import { togglePost } from './reducer'
import { goBack } from '@/Pages/OKBK/reducer'
import { client as gqlClient, subscribeToPush } from '@/Pages/OKBK/gqlQueries'
import api from '@/api'
import { setData as setArticle } from '@/Pages/Posts/components/Articles/articleReducer'
import { setEvent } from '@/Pages/Posts/components/Events/eventReducer'
import registerForPushNotificationsAsync from '../setUpNotifications'

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

    try {
      const url = await Linking.getInitialURL()
      if (url.includes('redirect')) {
        const { path, queryParams } = Linking.parse(url)
        console.log('initial url', url, path, queryParams)
        const [type, id] = queryParams.type.split('|')
        this.findRedirectToArticle(id, type)
      }
    } catch (e) {
      console.log(e)
    }

    registerForPushNotificationsAsync()
      .then(async (token) => {
        const possibleToken = userToken()
        AsyncStorage.getItem('userId', async (err, result) => {
          if (!result) AsyncStorage.setItem('userId', possibleToken)
          try {
            await gqlClient.query({
              query: subscribeToPush,
              variables: {
                userId: result || possibleToken,
                token,
              },
            })
          } catch (e) {
            throw new Error(e)
          }
        })

        console.log('push', token)
      })
      .catch((e) => {
        throw new Error(e)
      })

    this._notificationSubscription = Notifications.addListener(this._handleNotification)
  }

  componentWillUnmount() {
    this.removeLinkingListener()
  }

  _handleNotification = (notification) => {
    const isRedirectPush = Boolean(notification.data.id)
    if (isRedirectPush) {
      const { id, type } = notification.data
      this.findRedirectToArticle(id, type)
    }
  }

  findRedirectToArticle = (id, type) => {
    const { history, actions } = this.props
    const isEvent = type === 'event'
    const route = isEvent ? '/events' : '/'
    const setAction = isEvent ? actions.setEvent : actions.setArticle
    history.push(route)
    fetch(api.getPost(id, isEvent))
      .then((r) => r.json())
      .then(async (post) => {
        const opFailStatus = get(post, 'data.status', 0)
        if (opFailStatus === 404) return
        const mediaUrl = get(post, '_links.wp:featuredmedia.href', null)
          || `https://hansanglab.com/wp-json/wp/v2/media/${get(post, 'featured_media')}`

        const postData = {
          id,
          title: get(post, 'title.rendered', ''),
          mediaUrl,
          content: post.content,
        }
        const eventData = {
          ...postData,
          title: get(post, 'title', ''),
          description: get(post, 'description', ''),
          dateStart: get(post, 'start_date', '2019-01-01 00:00:00'),
          dateEnd: get(post, 'end_date', '2019-01-01 00:00:00'),
          organizer: get(post, 'organizer', ''),
          url: get(post, 'website', ''),
          place: get(post, 'venue', ''),
          allDay: get(post, 'allDay', false),
          image: get(post, 'image.url'),
        }

        const itemData = isEvent ? eventData : postData
        const inAppLink = await Linking.makeUrl('redirect', { type: `${type}|${id}` })

        setAction({ ...itemData, inAppLink })
        actions.togglePost(true, type)
      })
      .catch((e) => console.error(e))
  }

  handleRedirect = (event) => {
    const { path, queryParams } = Linking.parse(event.url)
    if (path.includes('redirect')) {
      console.log(event.url, path, queryParams)
      const [type, id] = queryParams.type.split('|')
      this.findRedirectToArticle(id, type)
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
    togglePost: (isOpen, type) => dispatch(togglePost(isOpen, type)),
    goBack: () => dispatch(goBack()),
    setArticle: (article) => dispatch(setArticle(article)),
    setEvent: (event) => dispatch(setEvent(event)),
  },
})

const RouterWithRouter = withRouter(RouterWithDrawer)

export default connect(
  mapStateFromProps,
  mapDispatchToProps,
)(RouterWithRouter)
