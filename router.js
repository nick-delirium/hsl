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
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import get from 'lodash/get'
import { Route } from 'react-router-native'
import TabBarIcon from './components/TabBarIcon'
import AllPosts from './Pages/AllPosts'
import Article from './Pages/AllPosts/components/Article'
import Event from './Pages/Events/Event'
import pages, { pageTitles, } from './constants/pages'


const NavBar = ({ navTitle, openDrawer, goBack, location }) => {
  const isArticle = /post\//.test(location)
  const isEvent = /event\//.test(location)
  const shouldRenderSpecificTitle = isArticle || isEvent
  const specificTitle = isArticle ? navTitle.articleTitle : navTitle.eventTitle
  const title = shouldRenderSpecificTitle ? specificTitle : pageTitles[location].toUpperCase()

  const shouldRenderBackButton = shouldRenderSpecificTitle
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
      <Text 
        style={shouldRenderSpecificTitle ? styles.articleTitle : styles.navTitle}
        numberOfLines={1}
      >
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
      navTitle={props.title}
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
    paddingTop: 45,
    paddingLeft: 20,
    paddingRight: 30,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#333376',
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: 'normal',
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 10,
  },
  navTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  }
})

const mapStateToProps = createStructuredSelector({
  title: (state) => { 
    const articleTitle = get(state, 'article.title')
    const eventTitle = get(state, 'event.title')

    return { articleTitle, eventTitle }
  }
})

export default connect(mapStateToProps)(RouterView)
