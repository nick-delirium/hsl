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
import AllPosts from './Pages/AllPosts'
import Article from './Pages/AllPosts/components/Article'
import pages from './constants/pages'

const RouterView = (props) => (
  <ScrollView style={styles.container}>
      <View style={styles.nav}>
        <TouchableOpacity style={{alignSelf: 'flex-start', marginTop: 20}}
          onPress={props.openDrawer}
        >
          <TabBarIcon name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'} />
        </TouchableOpacity>
      </View>

    <Route exact path={pages.all.path} component={AllPosts} />
    <Route path={pages.news.path} render={() => (<AllPosts onlyNews />)} />
    <Route path={pages.post.path} render={() => (<Article id />)} />
  </ScrollView>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEEEEE',
    padding: 20,
    flex: 1,
  },
  nav: {
    flex: 1,
    flexDirection: "row",
  },
})

export default RouterView