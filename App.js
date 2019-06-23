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
    this.cacheResourcesAsync() // ask for resources
      .then(() => this.setState({ areReasourcesReady: true })) // mark reasources as loaded
      .catch(error => console.error(`Unexpected error thrown when loading:
    ${error.stack}`));
  
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 2000,              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  render() {
    const { width, height } = Dimensions.get("window");
    // const {isSplashReady, isAppReady, fadeAnim} = this.satate
    // console.log(isSplashReady)
    /*if (!this.state.isSplashReady) {
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
      <View style={{ flex: 1 }} >
        <Animated.View style={{
          opacity: this.state.fadeAnim,
          flex: 1,
          // justifyContent: 'flexend',
          // flexDirection: 'column',
          // height: height
          }}>
          <Animated.Image
            source={require("./assets/images/HSL-logo.png")}
            style={[
              {...styles.container,
                resizeMode: "contain",
                // alignSelf: 'center',
                position: 'absolute',
                top: 50,
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
      */

     if (!this.state.areReasourcesReady) {
      return null;
    }
    
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{ flex: 1, resizeMode: 'contain', width: undefined, height: undefined }}
          source={require('./assets/images/HSL-logo.png')}
          onLoadEnd={() => { // wait for image's content to fully load [`Image#onLoadEnd`] (https://facebook.github.io/react-native/docs/image#onloadend)
            console.log('Image#onLoadEnd: hiding SplashScreen');
            SplashScreen.hide(); // Image is fully presented, instruct SplashScreen to hide
          }}
          fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300` 
        />
      </View>
    );
  }
  


/*_cacheSplashResourcesAsync = async () => {
  const gif = require('./assets/images/HSL-logo.png');
  console.log('sp res')
  return Asset.fromModule(gif).downloadAsync()
}
_cacheResourcesAsync = async () => {
  // SplashScreen.hide();
  
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
*/
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff'

  },

});

  // render() {
  //   if (!this.state.areReasourcesReady) {
  //     return null;
  //   }
    
  //   return (
      
    // return (
    //   <Provider store={store}>
    //     <NativeRouter>
    //       <View style={styles.container}>
    //         <StatusBar barStyle='light-content' />
    //         <RouterWithDrawer />
    //       </View>
    //     </NativeRouter>
    //   </Provider>
  //   )
  // }

  
//}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
// })
