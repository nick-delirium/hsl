import React from 'react'
import { StyleSheet, View, ScrollView, Text, Button } from 'react-native'
import { NativeRouter, Route, Link } from "react-router-native"
import Drawer from 'react-native-drawer'
import DrawerPanel from './components/DrawerPanel'
import RouterView from '../router.js'

const FirstScreen = () => (
  <View>
    <Text style={styles.header}>
      Screen One
    </Text>
    <Link to="/news">
      <Text>go to news</Text>
    </Link>
  </View>
)

const News = () => (
  <View>
    <Text>
      News
    </Text>
  </View>
)

class RouterWithDrawer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      drawerOpen: false,
      drawerDisabled: false,
    }
  }

  closeDrawer = () => {
    this._drawer.close()
  }

  openDrawer = () => {
    this._drawer.open()
  }

  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<DrawerPanel closeDrawer={this.closeDrawer} />}
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.4, shadowRadius: 15}}}
        onOpen={() => {
          this.setState({drawerOpen: true})
        }}
        onClose={() => {
          this.setState({drawerOpen: false})
        }}
        tweenDuration={100}
        panThreshold={0.08}
        disabled={this.state.drawerDisabled}
        openDrawerOffset={(viewport) => 100}
        closedDrawerOffset={() => 0}
        panOpenMask={0.2}
        acceptDoubleTap
        tapToClose
        captureGestures
        negotiatePan
      >
        <RouterView 
          openDrawer={this.openDrawer.bind(this)}
        />
      </Drawer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7699dd',
    padding: 20,
    flex: 1,
  },
  drawerLinks: {
    flexDirection: "column",
  },
  header: {
    fontSize: 20
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  subNavItem: {
    padding: 5
  },
  topic: {
    textAlign: "center",
    fontSize: 15
  }
})

export default RouterWithDrawer
