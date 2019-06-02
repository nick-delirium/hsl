import React from 'react';
import {
  Image,
  // Platform,
  ScrollView,
  // StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { WebBrowser } from 'expo';

import Header from '../components/Header';
import { MonoText } from '../components/StyledText';
import styles from '../constants/Styles';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    drawerOpen: false,
  };
  toggleDrawer = () => {
    this.setState({drawerOpen: ! this.state.drawerOpen})
  }

  render() {
    return (
      <View style={styles.container}>
        <Drawer
          open={this.state.drawerOpen}
          type='static'
          tapToClose={true}
          openDrawerOffset={0.5}
          closedDrawerOffset={0}
          content={<Text>MENU</Text>}
          tweenHandler={Drawer.tweenPresets.paralax}
          tweenEasing={'easeInOutQuad'}
          tweenDuration={400}
          onClose={this.closeDrawer}
        />

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View styles={styles.container}>
                <Header title='Home' toggleDrawer={this.toggleDrawer}/>
          </View>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

            <Text style={styles.getStartedText}>Get started by opening</Text>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
            </View>

            <Text style={styles.getStartedText}>
              I've changed this text.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}
