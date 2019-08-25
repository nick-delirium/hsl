import React from 'react'
import {
  StyleSheet,
  View,
  StatusBar,
  Animated,
  AsyncStorage
} from 'react-native'
import { AppLoading, SplashScreen } from 'expo'
import { Asset } from 'expo-asset'
import { connect } from 'react-redux'
import { NativeRouter } from 'react-router-native'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import * as FileSystem from 'expo-file-system'

import RouterWithDrawer from './Navigation'
import api from './api'
import {
  flatten,
  fetchAllSuccess,
  fetchAdsSuccess,
  fetchAdsReq,
  fetchAllPostsReq,
  fetchAllFail,
} from './Pages/Posts/reducer'
import cacheFolder from './constants/cacheFolder'

class AppIndex extends React.Component {
  constructor(props) {
    super(props);
    SplashScreen.preventAutoHide();

    this.state = {
      fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
      isSplashReady: false,
      isAppReady: false,
      areReasourcesReady: false,
    }
  }

  async componentDidMount() {
    const folder = await FileSystem.getInfoAsync(cacheFolder)
    if (!folder.exists) await FileSystem.makeDirectoryAsync(cacheFolder)
    AsyncStorage.getItem('cachedate', async (err, result) => {
      if (!result) return AsyncStorage.setItem('cachedate', (new Date()).toString())
      const diff = (new Date(result) - new Date())/1000/24/60/60
      if (diff < -1) {
        await FileSystem.deleteAsync(cacheFolder, { idempotent: true })
        await FileSystem.makeDirectoryAsync(cacheFolder)
        return AsyncStorage.setItem('cacheddate', (new Date()).toString())
      }
    })
  }

  render() {
    if (!this.state.isSplashReady) {
      return (
        <AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          onFinish={() => this.setState({ isSplashReady: true })}
          onError={console.warn}
          autoHideSplash={false}
        />
      )
    }

    if (this.state.isSplashReady && !this.state.isAppReady) {
      return (
        <Animated.View
          style={{
            opacity: this.state.fadeAnim,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Animated.Image
            source={require("./assets/images/HSL-logo.png")}
            style={{
              aspectRatio: 2.3,
              resizeMode: 'contain'
            }}
            onLoad={this._cacheResourcesAsync}
          />
        </Animated.View>
      )
    }

    return (
      <NativeRouter>
        <View style={styles.container}>
          <StatusBar
            style={{ zIndex: 10 }}
            barStyle='light-content'
            backgroundColor="#333376"
          />
          <RouterWithDrawer />
        </View>
      </NativeRouter>
    )
  }

  _cacheSplashResourcesAsync = async () => {
    const gif = require('./assets/images/HSL-logo.png');
    return Asset.fromModule(gif).downloadAsync()
  }

  _cacheResourcesAsync = async () => {
    SplashScreen.hide()
    const { posts } = this.props
    if (!posts || posts.length ===  0) {
      this.props.fetchPostsCustom()
      this.props.fetchAdsCustom()
      fetch(api.getPosts(20))
        .then(r => r.json())
        .then(posts => {
          fetch(api.getPromoCards(20))
          .then(r => r.json())
          .then(ads => {
            const result = posts
              .filter(post => !post.categories.includes(617))
              .map(
              (post, index) => {
                const count = index + 1
                const shouldRenderPromo = count % 3 === 0
                const pointer = count / 3 - 1
                const ad = ads[pointer]

                return index > 0 && shouldRenderPromo && ad
                  ? [ad, post] : post
              }
            )
            const flatResult = flatten(result)
            this.props.fetchAdsSuccessCustom()
            this.props.setPostsCustom(flatResult)
          })
          .catch(e => this.props.fetchFail(e))
        })
        .then(async () => {
          Animated.timing(
            this.state.fadeAnim,
            {
              toValue: 1,
              duration: 500,
            }
          ).start(() => {
            this.setState({ isAppReady: true })
          })
        })
        .catch(e => console.error(e))
    }
  }

  cacheResourcesAsync = async () => {
    const images = [
      require('./assets/images/HSL-logo.png'),
    ];
    const cacheImages = images.map(image => Asset.fromModule(image).downloadAsync());
    return Promise.all(cacheImages)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})

const mapStateToProps = createStructuredSelector({
  posts: (state) => get(state, 'posts.posts'),
})
const mapDispatchToProps = (dispatch) => ({
  fetchPostsCustom: () => dispatch(fetchAllPostsReq(20)),
  fetchAdsCustom: () => dispatch(fetchAdsReq(20)),
  setPostsCustom: (data) => dispatch(fetchAllSuccess(data)),
  fetchAdsSuccessCustom: () => dispatch(fetchAdsSuccess()),
  fetchFail: (e) => dispatch(fetchAllFail(e))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppIndex)
