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
import { Asset, AppLoading, SplashScreen } from 'expo';

import { Provider } from 'react-redux'
import { NativeRouter } from 'react-router-native'
import RouterWithDrawer from './Navigation'
import configureStore from './configureStore'

const store = configureStore()
//https://docs.expo.io/versions/latest/sdk/splash-screen/
//https://docs.expo.io/versions/latest/react-native/animations/
export default class App extends React.Component {
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

  componentDidMount() {
    this.cacheResourcesAsync()
      .then(() => this.setState({ areReasourcesReady: true }))
      .catch(error => console.error(`Unexpected error thrown when loading:
    ${error.stack}`))
  
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 2000,
      }
    ).start()
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
      <View>
        <Animated.View style={{
          opacity: this.state.fadeAnim,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: height
        }}>
          <Animated.Image
            source={require("./assets/images/HSL-logo.png")}
            style={[
              {
                resizeMode: "contain",
                alignSelf: 'center',
              }
            ]}
            onLoad={this._cacheResourcesAsync}
          />
        </Animated.View>
       </View>
      )
    }

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
  


  _cacheSplashResourcesAsync = async () => {
    const gif = require('./assets/images/HSL-logo.png');
    console.log('sp res')
    return Asset.fromModule(gif).downloadAsync()
  }
  _cacheResourcesAsync = async () => {
    
    setTimeout(()=>{ SplashScreen.hide(); console.log('sp hide'); this.setState({ isAppReady: true })}, 3000)
    // const images = [
      //   require('./assets/images/expo-icon.png'),
      //   require('./assets/images/slack-icon.png'),
      // ];
      
      // const cacheImages = images.map((image) => {
        //   return Asset.fromModule(image).downloadAsync();
        // });
        
        // await Promise.all(cacheImages); 
        // this.setState({ isAppReady: true });
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
});
