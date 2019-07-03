import React from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { Route } from 'react-router-native'
import TabBarIcon from './components/TabBarIcon'
import AllPosts from './Pages/AllPosts'
import Article from './Pages/AllPosts/components/Article'
import Event from './Pages/Events/Event'
import pages from './constants/pages'

let scrollRef = null

const NavBar = (props) => { //TODO: do normal header
  return (
    <View style={styles.nav}>
      <TouchableOpacity 
        style={{alignSelf: 'flex-start', marginTop: 20}}
        onPress={props.onPress}
      >
        <TabBarIcon name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'} />
      </TouchableOpacity>
      <Text>{props.title}</Text>
    </View>
  )
} 

const RouterView = (props) => (
  <View style={styles.container}>
    {/* <View style={styles.nav}>
      <TouchableOpacity style={{alignSelf: 'flex-start', marginTop: 20}}
        onPress={props.openDrawer}
      >
        <TabBarIcon name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'} />
      </TouchableOpacity>
    </View> */}
    <NavBar onPress={props.openDrawer} />

    <Route exact path={pages.all.path} component={AllPosts} />
    <Route path={pages.news.path} render={() => (<AllPosts type='news'/>)} />
    <Route path={pages.events.path} render={() => (<AllPosts type='events'/>)} />
    <Route path={pages.blogs.path} render={() => (<AllPosts type='blogs'/>)} />
    <Route path={pages.programs.path} render={() => (<AllPosts type='programs'/>)} />
    <Route path={pages.media.path} render={() => (<AllPosts type='media'/>)} />
    <Route path={pages.post.path} render={() => (<Article id />)} />
    <Route path={pages.event.path} render={() => (<Event slug />)} />
  </View>
)
  

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEEEEE',
    flex: 1,
  },
  nav: {
    flex: 1,
    flexDirection: "row",
  },
})

export default RouterView