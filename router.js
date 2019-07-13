import React from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  Share,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import get from 'lodash/get'
import { Route } from 'react-router-native'

import pages, { pageTitles, } from './constants/pages'
import Posts from './Pages/Posts'
import Article from './Pages/Posts/components/Articles/Article'
import Event from './Pages/Posts/components/Events/Event'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const NavBar = ({ navTitle, openDrawer, goBack, url, location }) => {
  const isArticle = /post\//.test(location)
  const isEvent = /event\//.test(location)
  const shouldRenderSpecificTitle = isArticle || isEvent
  const specificTitle = isArticle ? navTitle.articleTitle : navTitle.eventTitle
  const specificUrl = isArticle ? url.articleUrl : url.eventUrl

  const title = shouldRenderSpecificTitle ? specificTitle : pageTitles[location].toUpperCase()

  const shouldRenderBackButton = shouldRenderSpecificTitle
  const onIconPress = shouldRenderBackButton ? goBack : openDrawer
  const icon = shouldRenderBackButton ? 'back' : 'menu_icon'
  const share = async () => {
    try {
      const result = await Share.share({
        message: `${specificTitle}\n${specificUrl}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <View style={styles.nav}>
        <View 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity 
            onPress={onIconPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
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
          <Text 
            style={shouldRenderSpecificTitle ? styles.articleTitle : styles.navTitle}
            numberOfLines={1}
          >
            {title.length > 17 ? title.slice(0, 17)+'...' : title}
          </Text>
        </TouchableOpacity>
          {shouldRenderBackButton && (
            <View style={{ marginLeft: 'auto' }}>
              <TouchableOpacity 
                onPress={share}
                style={{ paddingLeft: 3, paddingRight: 3, paddingTop: 9, paddingBottom: 9 }}
              >
                <Image
                  source={require('./assets/images/share.png')}
                  style={{ height: 16, width: 16}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
          </View>
          )}
        </View>
    </View>
  )
} 

const RouterView = (props) => (
  <View style={styles.container}>
    {props.drawerOpen && <View style={{position: 'absolute', zIndex: 10, top: 0, left: 0, height, width, backgroundColor: '#000000', opacity: 0.7}} />}
    <NavBar
      openDrawer={props.openDrawer}
      location={props.location}
      goBack={props.goBack}
      navTitle={props.title}
      url={props.url}
    />

    <Route exact path={pages.all.path} component={Posts} />
    <Route path={pages.news.path} render={() => (<Posts type='news'/>)} />
    <Route path={pages.events.path} render={() => (<Posts type='events'/>)} />
    <Route path={pages.blogs.path} render={() => (<Posts type='blogs'/>)} />
    <Route path={pages.programs.path} render={() => (<Posts type='programs'/>)} />
    <Route path={pages.media.path} render={() => (<Posts type='media'/>)} />
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
    paddingTop: 45,
    paddingLeft: 20,
    paddingRight: 30,
    paddingBottom: 10,
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
  },
  url: (state) => {
    const articleUrl = get(state, 'article.link')
    const eventUrl = get(state, 'event.link')

    return { articleUrl, eventUrl }
  }
})

export default connect(mapStateToProps)(RouterView)
