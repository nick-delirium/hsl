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
import Places from './Pages/Places'
import { togglePost } from './Navigation/reducer'
import pages, { pageTitles, } from './constants/pages'
import Posts from './Pages/Posts'
import Article from './Pages/Posts/components/Articles/Article'
import Event from './Pages/Posts/components/Events/Event'
import Search from './Pages/Search'
import SearchPanel from './Pages/Search/SearchPanel'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const NavBar = ({ navTitle, openDrawer, closePost, url, location, type, isPostOpen }) => {
  const isSearch = /search/.test(location)
  const isInsidePost = isPostOpen
  const isArticle = type === 'article'
  const isEvent = type === 'event'
  const shouldRenderSpecificTitle = isInsidePost || isSearch
  const specificTitle = isArticle ? navTitle.articleTitle : navTitle.eventTitle
  const specificUrl = isArticle ? url.articleUrl : url.eventUrl
  const title = shouldRenderSpecificTitle ? specificTitle : pageTitles[location].toUpperCase()
  const shouldRenderBackButton = shouldRenderSpecificTitle
  const shouldRenderSearch = (/news|blogs|programs|media|search/i.test(location) || location === '/') && !isPostOpen

  const onIconPress = shouldRenderBackButton ? closePost : openDrawer
  const icon = shouldRenderBackButton ? 'back' : 'menu_icon'
  const share = async () => {
    try {
      const result = await Share.share({
        message: `${specificTitle}\n${specificUrl}`,
      });
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
            justifyContent: 'flex-start',
            paddingRight: 5,
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
          >
            {title && title.slice(0, 20)}
            {title && title.length > 20 && '...'}
          </Text>
        </TouchableOpacity>
        </View>
        {isInsidePost && (
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
        {shouldRenderSearch && <SearchPanel isSearch={isSearch} />}
    </View>
  )
}

const RouterView = (props) => (
  <View style={styles.container}>
    {props.drawerOpen && <View style={{position: 'absolute', zIndex: 10, top: 0, left: 0, height, width, backgroundColor: '#000000', opacity: 0.7}} />}
    <NavBar
      openDrawer={props.openDrawer}
      location={props.location}
      closePost={props.closePost}
      navTitle={props.title}
      url={props.url}
      type={props.type}
      isPostOpen={props.isPostOpen}
    />

    <Route exact path={pages.all.path} component={Posts} />
    <Route path={pages.news.path} render={() => (<Posts type='news'/>)} />
    <Route path={pages.events.path} render={() => (<Posts type='events'/>)} />
    <Route path={pages.blogs.path} render={() => (<Posts type='blogs'/>)} />
    <Route path={pages.programs.path} render={() => (<Posts type='programs'/>)} />
    <Route path={pages.media.path} render={() => (<Posts type='media'/>)} />
    <Route path={pages.search.path} render={() => (<Search query />)} />
    <Route path={pages.post.path} render={() => (<Article id />)} />
    <Route path={pages.event.path} render={() => (<Event slug />)} />
    <Route path={pages.places.path} component={Places} />
  </View>
)


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D1D0D0',
    flex: 1,
  },
  nav: {
    paddingTop: 45,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    backgroundColor: '#333376',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: 'normal',
    color: 'rgba(255, 255, 255, 0.6)',
    paddingLeft: 10,
  },
  navTitle: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  }
})

const mapStateToProps = createStructuredSelector({
  isPostOpen: (state) => get(state, 'url.isPostOpen'),
  type: (state) => get(state, 'url.type'),
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
const mapDispatchToProps = dispatch => ({
  closePost: () => dispatch(togglePost(false, ''))
})
const RouterWithMemo = React.memo(RouterView)
export default connect(mapStateToProps, mapDispatchToProps)(RouterWithMemo)
