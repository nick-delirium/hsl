import React from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Button,
} from 'react-native'
import { Route } from 'react-router-native'
import News from './Pages/News'
import TestPage from './Pages/TestPage'

const RouterView = (props) => (
  <ScrollView style={styles.container}>
      <View style={styles.nav}>
        <Button
          onPress={props.openDrawer}
          title="Open Drawer"
        />
      </View>
    
    <Route exact path="/" component={News} />
    <Route path="/testpage" component={TestPage} />
  </ScrollView>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7699dd',
    padding: 20,
    flex: 1,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
})

export default RouterView