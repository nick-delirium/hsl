import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { Route } from 'react-router-native'
import TabBarIcon from './components/TabBarIcon'
import AllPosts from './Pages/AllPosts'
import Article from './Pages/AllPosts/components/Article'
import pages from './constants/pages'

let scrollRef = null

const RouterView = (props) => (
  <View ref={(ref) => scrollRef = ref} style={styles.container}>
      {/* <View style={styles.nav}>
        <TouchableOpacity style={{alignSelf: 'flex-start', marginTop: 20}}
          onPress={props.openDrawer}
        >
          <TabBarIcon name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'} />
        </TouchableOpacity>
      </View> */}
      <NavBar onPress={props.openDrawer}/>

    <Route exact path={pages.all.path} component={AllPosts} />
    <Route path={pages.news.path} render={() => (<AllPosts type='news'/>)} />
    <Route path={pages.events.path} render={() => (<AllPosts type='events'/>)} />
    <Route path={pages.blogs.path} render={() => (<AllPosts type='blogs'/>)} />
    <Route path={pages.programs.path} render={() => (<AllPosts type='programs'/>)} />
    <Route path={pages.media.path} render={() => (<AllPosts type='media'/>)} />
    <Route path={pages.post.path} render={
      () => {
        scrollRef.scrollTo({ x: 0, y: 0,animated: false })
        return <Article id />
      }}
    />
  </View>
)
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