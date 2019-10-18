/* eslint-disable no-extra-boolean-cast */
import React from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import fonts from '@/constants/Styles'
import Colors from '@/constants/Colors'
import CardArticle from '@/Pages/Posts/components/Articles/CardArticle'
import Article from '@/Pages/Posts/components/Articles/Article'
import { setFeedType } from '@/Navigation/reducer'

import {
  rmRefreshFlag,
  getNews,
} from '../reducer'

const { height } = Dimensions.get('window')

class Feed extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      isEndListLoading: false,
    }
  }

  componentDidMount() {
    console.log('m')
    this.getInitialData()
  }

  componentDidUpdate(prevProps) {
    const { isRefresh, removeRefreshFlag } = this.props
    if (isRefresh && !prevProps.isRefresh) {
      this._FlatList.scrollToOffset({ offset: 0, animated: true })
      removeRefreshFlag()
    }
  }

  loadMoreData = () => {
    const { page, isEndListLoading } = this.state
    const { isLoading } = this.props
    if (isLoading) return null
    if (!isEndListLoading) {
      this.setState({ isEndListLoading: true }, () => {
        setTimeout(() => {
          const newPage = page + 1
          this.getData(20, newPage)
        }, 0)
      })
    }
  }

  getData = (treshold, page = 1) => {
    const { fetchNews } = this.props
    fetchNews(treshold, false, page)
    this.setState({ page, isEndListLoading: false })
  }

  getInitialData = () => {
    const { fetchNews, posts } = this.props
    if (posts.length === 0) fetchNews(20, false, 1, true)
  }

  refreshData = () => {
    const { fetchNews } = this.props
    fetchNews(20, false, 1, true)
  }

  _keyExtractor = (item) => `_${item.id}`

  renderCardItem = ({ item }) => {
    const descrItem = get(item, 'description', '')
      .replace(/<[^>]*>/g, '')
      .slice(0, 100)
      .split('')
      .join('')
    const descrRendered = get(item, 'excerpt.rendered', '')
      .replace(/<[^>]*>/g, '')
      .slice(0, 100)
      .split('')
      .join('')
    return (
      <CardArticle
        key={item.id}
        id={item.id}
        data={item}
        link={item.link}
        title={item.title.rendered || item.title}
        descr={descrRendered || descrItem}
        mediaUrl={item.mediaUrl ? item.mediaUrl : null}
        content={get(item, 'content.rendered')}
      />
    )
  }

  renderPost = () => (
    <View style={styles.postWrapper}>
      <Article id />
    </View>
  )

  render() {
    const {
      posts,
      isLoading,
      isPostOpen,
    } = this.props
    console.log(posts.length)
    const dataWithMedia = posts && posts.length > 0
      ? posts.map((item) => {
        const mediaUrl = get(item, '_links.wp:featuredmedia.href', null)
          || `https://hansanglab.com/wp-json/wp/v2/media/${get(item, 'featured_media')}`
        return {
          ...item,
          mediaUrl,
        }
      }) : []
    return (
      <View style={{ position: 'relative', flex: 1, backgroundColor: Colors.backgroundGray }}>
        {isPostOpen && this.renderPost()}
        {dataWithMedia.length > 0 && (
          <FlatList
            data={dataWithMedia}
            style={{ flex: 1 }}
            ref={(r) => this._FlatList = r}
            renderItem={this.renderCardItem}
            onRefresh={this.refreshData}
            refreshing={isLoading}
            keyExtractor={this._keyExtractor}
            onEndReached={dataWithMedia.length > 5 ? this.loadMoreData : null}
            removeClippedSubviews
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  postWrapper: {
    position: 'absolute',
    top: 0,
    paddingBottom: 92, // height of header
    left: 0,
    zIndex: 9,
    height,
    backgroundColor: '#E1E1E1',
    flex: 1,
  },
})

const mapStateFromProps = createStructuredSelector({
  isLoading: (state) => get(state, 'okbk.isLoading'),
  // isError: (state) => get(state, 'posts.isError'),
  posts: (state) => get(state, 'okbk.posts'),
  isPostOpen: (state) => get(state, 'url.isPostOpen'),
  postType: (state) => get(state, 'url.type'),
  isRefresh: (state) => get(state, 'okbk.isRefresh'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchNews: (limit, isRefresh = false, page = 1, isInitial = false) => (
    dispatch(getNews(limit, isRefresh, page, isInitial))
  ),

  setFeedTypeFromRender: (value) => dispatch(setFeedType(value)),
  removeRefreshFlag: () => dispatch(rmRefreshFlag()),
})

export default connect(
  mapStateFromProps,
  mapDispatchToProps,
)(Feed)
