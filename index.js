
import React from 'react'
import {
  StyleSheet,
  View,
  StatusBar,
  Animated,
  AsyncStorage,
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
import { cacheFolder, cacheDateStorageKey } from './constants/cacheFolder'
import { logo, defaultPostsLength } from './constants/miscConsts'

class AppIndex extends React.Component {
  constructor(props) {
    super(props)
    SplashScreen.preventAutoHide()

    this.state = {
      fadeAnim: new Animated.Value(0), // Initial value for opacity: 0
      isSplashReady: false,
      isAppReady: false,
    }
  }

  async componentDidMount() {
    const folder = await FileSystem.getInfoAsync(cacheFolder)
    if (!folder.exists) await FileSystem.makeDirectoryAsync(cacheFolder)
    AsyncStorage.getItem(cacheDateStorageKey, async (err, result) => {
      if (!result) return AsyncStorage.setItem(cacheDateStorageKey, (new Date()).toString())
      const diff = (new Date(result) - new Date()) / 1000 / 24 / 60 / 60
      if (diff < -1) {
        try {
          await FileSystem.deleteAsync(cacheFolder, { idempotent: true })
          await FileSystem.makeDirectoryAsync(cacheFolder)
        } catch (e) {
          console.log(e)
        }
        return AsyncStorage.setItem(cacheDateStorageKey, (new Date()).toString())
      }
    })
  }

  _cacheSplashResourcesAsync = async () => Asset.fromModule(logo).downloadAsync()


  _cacheResourcesAsync = async () => {
    SplashScreen.hide()
    const {
      posts,
      fetchPostsCustom,
      fetchAdsCustom,
      fetchAdsSuccessCustom,
      setPostsCustom,
      fetchFail,
    } = this.props
    const { fadeAnim } = this.state
    if (!posts || posts.length === 0) {
      fetchPostsCustom()
      fetchAdsCustom()
      fetch(api.getPosts(defaultPostsLength))
        .then((r) => r.json())
        .then((fetchedPosts) => {
          fetch(api.getPromoCards(defaultPostsLength))
            .then((r) => r.json())
            .then((ads) => {
              const result = fetchedPosts
                .filter((post) => !post.categories.includes(617))
                .map(
                  (post, index) => {
                    const count = index + 1
                    const shouldRenderPromo = count % 3 === 0
                    const pointer = count / 3 - 1
                    const ad = ads[pointer]

                    return index > 0 && shouldRenderPromo && ad
                      ? [ad, post] : post
                  },
                )
              const flatResult = flatten(result)
              fetchAdsSuccessCustom()
              setPostsCustom(flatResult)
            })
            .catch((e) => fetchFail(e))
        })
        .then(async () => {
          Animated.timing(
            fadeAnim,
            {
              toValue: 1,
              duration: 500,
            },
          ).start(() => {
            this.setState({ isAppReady: true })
          })
        })
        .catch((e) => console.error(e))
    }
  }

  cacheResourcesAsync = async () => {
    const images = [
      logo,
    ]
    const cacheImages = images.map((image) => Asset.fromModule(image).downloadAsync())
    return Promise.all(cacheImages)
  }

  render() {
    const { isSplashReady, isAppReady, fadeAnim } = this.state
    if (!isSplashReady) {
      return (
        <AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          onFinish={() => this.setState({ isSplashReady: true })}
          onError={console.warn}
          autoHideSplash={false}
        />
      )
    }

    if (isSplashReady && !isAppReady) {
      return (
        <Animated.View
          style={{
            opacity: fadeAnim,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Animated.Image
            source={logo}
            style={{
              aspectRatio: 2.3,
              resizeMode: 'contain',
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
            barStyle="light-content"
            backgroundColor="#333376"
          />
          <RouterWithDrawer />
        </View>
      </NativeRouter>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  fetchFail: (e) => dispatch(fetchAllFail(e)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppIndex)
