import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Share,
  TouchableOpacity,
} from 'react-native'
import get from 'lodash/get'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { formatEventDate } from '@/common/format'
import { pageTitles } from '@/constants/pages'
import { getPosts, getPostsByCategory, getEvents } from '@/Pages/Posts/reducer'
import SearchPanel from '@/Pages/Search/SearchPanel'

const Header = ({
  navTitle,
  openDrawer,
  closePost,
  goBack,
  url,
  location,
  type,
  isPostOpen,
  fetchPosts,
  fetchByCategory,
  fetchEvents,
  categories,
  feedType,
  tabTitle,
}) => {
  const isSearch = /search/.test(location.pathname)
  const isInsidePost = isPostOpen
  const isArticle = type === 'article'
  const isEventArticle = type === 'event'
  const isOKBK = /okbk/.test(location.pathname)
  const shouldRenderSpecificTitle = isInsidePost || isSearch
  const specificTitle = isArticle ? navTitle.articleTitle
    : isEventArticle ? navTitle.eventTitle : undefined
  const specificUrl = isArticle ? url.articleUrl : url.eventUrl
  const title = isOKBK
    ? tabTitle : shouldRenderSpecificTitle
      ? specificTitle : pageTitles[location.pathname].toUpperCase()
  const shouldRenderBackButton = shouldRenderSpecificTitle
  const shouldRenderSearch = (/news|blogs|programs|media|search/i.test(location.pathname) || location.pathname === '/') && !isPostOpen

  const onBackIconPress = isSearch && !isPostOpen ? goBack : closePost
  const share = async () => {
    try {
      await Share.share({
        message: `${specificTitle}\n${specificUrl}`,
      })
    } catch (error) {
      alert(error.message)
    }
  }

  const refreshData = () => {
    if (feedType === 'events') {
      const startDate = formatEventDate()
      // startDate, endDate, limit, isRefresh
      fetchEvents(startDate, undefined, undefined, true)
    } else {
      const category = categories.find((cat) => (cat.slug === feedType))
      if (feedType && category) {
        if (category && category.id) {
          // category, limit, isRefresh
          fetchByCategory(category.id, undefined, true)
        } else {
          console.log(`Error: category ${feedType} not found`)
        }
      }
    }
    if (!feedType) {
      // limit, isRefresh
      fetchPosts(undefined, true)
    }
  }

  return (
    <View style={styles.nav}>
      <View
        style={styles.container}
      >
        {shouldRenderBackButton ? (
          <TouchableOpacity
            onPress={onBackIconPress}
            style={styles.clickableZone}
          >
            <View
              style={styles.backIcon}
            >
              <Image
                source={require('../assets/images/back.png')}
                style={{ width: 19, height: 19 }}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={openDrawer}
            style={styles.clickableZone}
          >
            <Image
              source={require('../assets/images/menu_icon.png')}
              style={{ width: 38, height: 38 }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => (shouldRenderSpecificTitle ? null : refreshData())}
          activeOpacity={shouldRenderSpecificTitle ? 1 : 0.2}
        >
          <Text
            style={shouldRenderSpecificTitle ? styles.articleTitle : styles.navTitle}
          >
            {title && title.slice(0, 23)}
            {title && title.length > 23 && '...'}
          </Text>
        </TouchableOpacity>
      </View>
      {isInsidePost && (
        <View style={{ marginLeft: 'auto' }}>
          <TouchableOpacity
            onPress={share}
            style={{
              paddingLeft: 3,
              paddingRight: 3,
              paddingTop: 9,
              paddingBottom: 9,
            }}
          >
            <Image
              source={require('../assets/images/share.png')}
              style={{ height: 16, width: 16 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
      {shouldRenderSearch && <SearchPanel isSearch={isSearch} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 5,
  },
  clickableZone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 9,
    paddingLeft: 6,
    paddingRight: 6,
    marginRight: -3,
    zIndex: 11,
    paddingBottom: 9,
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
  },
})

const mapStateFromProps = createStructuredSelector({
  isLoading: (state) => get(state, 'posts.isLoading'),
  isError: (state) => get(state, 'posts.isError'),
  posts: (state) => get(state, 'posts.posts'),
  data: (state) => get(state, 'posts.data'),
  categories: (state) => get(state, 'url.categories'),
  postType: (state) => get(state, 'url.type'),
  feedType: (state) => get(state, 'url.feedType'),
  tabTitle: (state) => get(state, 'okbk.title'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPosts: (limit, isRefresh) => dispatch(getPosts(limit, isRefresh)),
  fetchByCategory: (cat, limit, isRefresh) => dispatch(getPostsByCategory(cat, limit, isRefresh)),
  fetchEvents: (startDate, endDate, limit, isRefresh) => {
    dispatch(getEvents(startDate, endDate, limit, isRefresh))
  },
})

const HeaderWithRouter = withRouter(Header)

export default connect(
  mapStateFromProps,
  mapDispatchToProps,
)(HeaderWithRouter)
