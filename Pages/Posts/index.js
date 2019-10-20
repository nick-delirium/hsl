import React from 'react'
import {
  FlatList,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import CardArticle from './components/Articles/CardArticle'
import CardEvent from './components/Events/CardEvent'
import {
  getPosts,
  getPostsByCategory,
  getEvents,
  rmRefreshFlag,
} from './reducer'
import { getCategories, setFeedType } from '@/Navigation/reducer'
import { formatEventDate } from '@/common/format'
import Article from './components/Articles/Article'
import Event from './components/Events/Event'
import BlogCategories from './components/Articles/BlogCategories'

const { height } = Dimensions.get('window')

class AllPosts extends React.PureComponent {
  constructor(props) {
    super(props)
    this._FlatList = React.createRef()
    this.state = {
      page: 1,
      isEndListLoading: false,
    }
  }

  componentDidMount() {
    this.getInitialData()
    const { type, setFeedTypeFromRender } = this.props
    if (type) setFeedTypeFromRender(type)
    else setFeedTypeFromRender('')
  }

  componentDidUpdate(prevProps) {
    const { isRefresh, removeRefreshFlag, type, usedCategories } = this.props
    const isCategoryChanged = prevProps.usedCategories.subcat !== usedCategories.subcat
      || prevProps.usedCategories.mainCat !== usedCategories.mainCat
    const isTypeChanged = type !== prevProps.type
    if (isTypeChanged) this.getInitialData()
    if (isRefresh && !prevProps.isRefresh && this._FlatList.current) {
      this._FlatList.current.scrollToOffset({ offset: 0, animated: true })
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
    const {
      fetchPosts,
      fetchByCategory,
      fetchEvents,
      type,
      categories,
      subCategories,
    } = this.props

    if (type === 'events') {
      const startDate = formatEventDate()
      fetchEvents(startDate, undefined, undefined, treshold)
      this.setState({ page, isEndListLoading: false })
    } else {
      const category = categories.find((cat) => (cat.slug === type))
      if (type && category) {
        if (category && category.id) {
          if (type === 'blogs' && subCategories.length > 0) {
            const catIds = subCategories.join(',')
            fetchByCategory(catIds, treshold, undefined, category.id, page)
            this.setState({ page, isEndListLoading: false })
          } else {
            fetchByCategory(category.id, treshold, undefined, undefined, page)
            this.setState({ page, isEndListLoading: false })
          }
        } else {
          console.log(`Error: category ${type} not found`)
        }
      } else {
        fetchPosts(treshold, false, page)
        this.setState({ page, isEndListLoading: false })
      }
    }
  }

  getInitialData = () => {
    const {
      fetchPosts,
      fetchByCategory,
      fetchCategories,
      fetchEvents,
      posts,
      type,
      categories,
      subCategories,
    } = this.props
    if (!categories || categories.length === 0) {
      fetchCategories()
    }

    // eslint-disable-next-line quotes
    if (type === 'events') {
      const startDate = formatEventDate()
      fetchEvents(startDate, undefined, undefined, true)
    } else {
      const category = categories.find((cat) => (cat.slug === type))
      if (type && category) {
        if (category && category.id) {
          console.log(`fetching for ${type}`)
          if (type === 'blogs' && subCategories.length > 0) {
            const catIds = subCategories.join(',')
            fetchByCategory(catIds, undefined, undefined, category.id, 1, true)
          } else fetchByCategory(category.id, undefined, undefined, undefined, 1, true)
        } else {
          console.log(`Error: category ${type} not found`)
        }
      }
    }
    if (posts.length === 0) fetchPosts(20, false, 1, true)
  }

  refreshData = () => {
    const {
      fetchPosts,
      fetchByCategory,
      fetchEvents,
      type,
      categories,
      subCategories,
    } = this.props
    if (type === 'events') {
      const startDate = formatEventDate()
      fetchEvents(startDate, undefined, undefined, true)
    } else {
      const category = categories.find((cat) => (cat.slug === type))
      if (type && category) {
        if (category && category.id) {
          if (type === 'blogs' && subCategories.length > 0) {
            const catIds = subCategories.join(',')
            fetchByCategory(catIds, undefined, true, category.id, 1)
          } else fetchByCategory(category.id, undefined, undefined, undefined, 1, true)
        } else {
          console.log(`Error: category ${type} not found`)
        }
      }
    }
    if (type === undefined) fetchPosts(20, false, 1, true)
  }

  _keyExtractor = (item) => `_${item.id}`

  renderCardItem = ({ item }) => {
    const { categories, type } = this.props
    const descrItem = get(item, 'description', '')
      .replace(/<[^>]*>/g, '')
      .slice(0, 100)
      .split('')
      .join('')

    if (type === 'events') {
      return (
        <CardEvent
          key={item.id}
          id={item.id}
          description={get(item, 'description', '')}
          smallDescription={descrItem}
          title={item.title}
          dateStart={item.start_date} // utc_start_date
          dateEnd={item.end_date}
          image={get(item, 'image.url')}
          organizer={item.organizer} // array [0].organizer, url
          url={item.website}
          place={item.venue}
          slug={item.slug}
          allDay={item.allDay}
          categories={item.categories}
          tags={item.tags}
          cost={item.cost} // cost_details
          link={item.url}
        />
      )
    }
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
        categories={categories.filter((cat) => (item.categories.includes(cat.id)))}
        content={get(item, 'content.rendered')}
        type={type}
      />
    )
  }

  renderPost = (type) => {
    switch (type) {
      case 'event':
        return (
          <View style={styles.postWrapper}>
            <Event slug />
          </View>
        )
      default:
        return (
          <View style={styles.postWrapper}>
            <Article id />
          </View>
        )
    }
  }

  render() {
    const {
      posts,
      isLoading,
      type,
      data,
      isPostOpen,
      postType,
    } = this.props

    const displayingPosts = type ? data : posts
    const dataWithMedia = displayingPosts && displayingPosts.length
      ? displayingPosts.map((item) => {
        const mediaUrl = get(item, '_links.wp:featuredmedia.href', null)
          || `https://hansanglab.com/wp-json/wp/v2/media/${get(item, 'featured_media')}`
        return {
          ...item,
          mediaUrl,
        }
      }) : []
    return (
      <View style={{ position: 'relative', flex: 1 }}>
        {isPostOpen && this.renderPost(postType)}
        {dataWithMedia.length > 0 && (
          <FlatList
            data={dataWithMedia}
            style={{ flex: 1 }}
            ref={this._FlatList}
            renderItem={this.renderCardItem}
            onRefresh={this.refreshData}
            refreshing={isLoading}
            keyExtractor={this._keyExtractor}
            onEndReached={dataWithMedia.length > 5 ? this.loadMoreData : null}
            removeClippedSubviews
            onEndReachedThreshold={0.5}
            ListHeaderComponent={type === 'blogs' ? (<BlogCategories />) : undefined}
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
  isLoading: (state) => get(state, 'posts.isLoading'),
  isError: (state) => get(state, 'posts.isError'),
  posts: (state) => get(state, 'posts.posts'),
  data: (state) => get(state, 'posts.data'),
  usedCategories: (state) => {
    const mainCat = get(state, 'posts.mainCategory')
    const subcat = get(state, 'posts.subcategory')
    return { mainCat, subcat }
  },
  categories: (state) => get(state, 'url.categories'),
  subCategories: (state) => get(state, 'url.subCategories'),
  isPostOpen: (state) => get(state, 'url.isPostOpen'),
  postType: (state) => get(state, 'url.type'),
  isRefresh: (state) => get(state, 'posts.isRefresh'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPosts: (limit, isRefresh = false, page = 1, isInitial = false) => (
    dispatch(getPosts(limit, isRefresh, page, isInitial))
  ),
  fetchByCategory: (cat, limit, isRefresh = false, mainCategory, page = 1, isInitial = false) => {
    dispatch(getPostsByCategory(cat, limit, isRefresh, mainCategory, page, isInitial))
  },
  fetchEvents: (startDate, endDate, limit, isInitial = false) => (
    dispatch(getEvents(startDate, endDate, limit, isInitial))
  ),
  fetchCategories: () => dispatch(getCategories()),
  setFeedTypeFromRender: (value) => dispatch(setFeedType(value)),
  removeRefreshFlag: () => dispatch(rmRefreshFlag()),
})

export default connect(
  mapStateFromProps,
  mapDispatchToProps,
)(AllPosts)
