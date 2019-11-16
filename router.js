import React from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import get from 'lodash/get'
import { Route } from 'react-router-native'
import Places from './Pages/Places'
import { togglePost } from './Navigation/reducer'
import pages from './constants/pages'
import Posts from './Pages/Posts'
import Article from './Pages/Posts/components/Articles/Article'
import Event from './Pages/Posts/components/Events/Event'
import Search from './Pages/Search'
import Header from './components/Header'
import FakeHeader from './components/FakeHeader'
import okbk from './Pages/OKBK'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const RouterView = ({
  drawerOpen,
  openDrawer,
  closePost,
  goBack,
  title,
  url,
  type,
  isPostOpen,
  shouldDisplayOKBKHeader,
}) => (
  <View style={styles.container}>
    {drawerOpen && (
      <View
        style={{
          position: 'absolute',
          zIndex: 10,
          top: 0,
          left: 0,
          height,
          width,
          backgroundColor: '#000000',
          opacity: 0.7,
        }}
      />
    )}
    <Header
      openDrawer={openDrawer}
      closePost={closePost}
      goBack={goBack}
      navTitle={title}
      url={url}
      type={type}
      isPostOpen={isPostOpen}
    />
    {shouldDisplayOKBKHeader && <FakeHeader />}
    <Route exact path={pages.all.path} render={() => <Posts type="all" />} />
    <Route path={pages.news.path} render={() => (<Posts type="news" />)} />
    <Route path={pages.events.path} render={() => (<Posts type="events" />)} />
    <Route path={pages.blogs.path} render={() => (<Posts type="blogs" />)} />
    <Route path={pages.programs.path} render={() => (<Posts type="programs" />)} />
    <Route path={pages.media.path} render={() => (<Posts type="media" />)} />
    <Route path={pages.search.path} render={() => (<Search />)} />
    <Route path={pages.post.path} render={() => (<Article />)} />
    <Route path={pages.event.path} render={() => (<Event />)} />
    <Route path={pages.places.path} component={Places} />
    <Route path={pages.okbk.path} component={okbk} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1E1E1',
    flex: 1,
  },
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
    const articleInApp = get(state, 'article.inAppLink')
    const eventInApp = get(state, 'event.inAppLink')

    return {
      articleUrl,
      eventUrl,
      eventInApp,
      articleInApp,
    }
  },
  shouldDisplayOKBKHeader: (state) => get(state, 'okbk.shouldRenderFakeHeader'),
})

const mapDispatchToProps = (dispatch) => ({
  closePost: () => dispatch(togglePost(false, '')),
})

const RouterWithMemo = React.memo(RouterView)
export default connect(mapStateToProps, mapDispatchToProps)(RouterWithMemo)
