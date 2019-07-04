import React from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { Route } from 'react-router-native'
import TabBarIcon from './components/TabBarIcon'
import AllPosts from './Pages/AllPosts'
import Article from './Pages/AllPosts/components/Article'
import Event from './Pages/Events/Event'
import pages, { pageTitles, } from './constants/pages'


const NavBar = ({ openDrawer, goBack, location }) => {
  const title = pageTitles[location]
  const shouldRenderBackButton = /event|post/.test(location)
  const onIconPress = shouldRenderBackButton ? goBack : openDrawer
  const icon = shouldRenderBackButton ? 'back' : 'menu_icon'
  return (
    <View style={styles.nav}>
      <TouchableOpacity 
        onPress={onIconPress}
      >
        {shouldRenderBackButton ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 9,
              paddingBottom: 9,
            }}
          >
            <Image 
              source={require(`./assets/images/back.png`)}
              style={{ width: 19, height: 19 }}  
            />
          </View>
        ) : (
          <Image 
            source={require(`./assets/images/menu_icon.png`)}
            style={{ width: 38, height: 38 }}  
          />
        )}
      </TouchableOpacity>
      <Text style={styles.navTitle}>
        {title}
      </Text>
    </View>
  )
} 

const RouterView = (props) => (
  <View style={styles.container}>
    <NavBar 
      openDrawer={props.openDrawer}
      location={props.location}
      goBack={props.goBack}
    />

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
    flexDirection: 'row',
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 30,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#333376',
  },
  navTitle: {
    marginLeft: 5,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  }
})

export default RouterView