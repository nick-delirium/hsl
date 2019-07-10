import React from 'react'
import { 
  StyleSheet, 
  View, 
  StatusBar,
  Image,
  Platform,
  Text,
  Animated,
  Easing,
  Dimensions
} from 'react-native'
import { Asset, AppLoading, SplashScreen } from 'expo'
import { connect } from 'react-redux'
import { NativeRouter } from 'react-router-native'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'

import RouterWithDrawer from './Navigation'
import api from './api'
import { fetchAllSuccess } from './Pages/AllPosts/reducer'

//https://docs.expo.io/versions/latest/sdk/splash-screen/
//https://docs.expo.io/versions/latest/react-native/animations/
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

  render() {
    const { width, height } = Dimensions.get("window");

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
      fetch(api.getPosts(20))
        .then((response) => response.json())
        .then((news) => {
          this.props.setNews(news)
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
  setNews: (data) => dispatch(fetchAllSuccess(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppIndex)
