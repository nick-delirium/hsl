import React from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { Route } from 'react-router-native'
import TabBarIcon from './components/TabBarIcon'
import News from './Pages/News'
import TestPage from './Pages/TestPage'

const RouterView = (props) => (
  <ScrollView style={styles.container}>
      <View style={styles.nav}>
      <TouchableOpacity style={{alignSelf: 'flex-start', marginTop: 20}}
          onPress={props.openDrawer}
        >
          <TabBarIcon name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'} />
        </TouchableOpacity>
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
    flex: 1,
    flexDirection: "row",
  },
})

export default RouterView