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
import CardArticle from './components/Articles/CardArticle.js'
import CardEvent from './components/Events/CardEvent'
import { getPosts, getPostsByCategory, getEvents } from './reducer'
import { getCategories } from '@/Navigation/reducer'
import { formatEventDate } from '@/common/format'
import Article from './components/Articles/Article'
import Event from './components/Events/Event'
const height = Dimensions.get('window').height

class AllPosts extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      treshold: 0
    }
  }

  componentDidMount() {
    this.getInitialData()
  }

  loadMoreData = () => {
    const { treshold } = this.state
    const { isLoading } = this.props
    if (isLoading) return null
    else {
      const newTreshold = treshold + 10
      this.getData(newTreshold)
      this.setState({ treshold: newTreshold })
    }
  }

  getData = (treshold) => {
    const {
      fetchPosts,
      fetchByCategory,
      fetchCategories,
      fetchEvents,
      posts,
      type,
      data,
      categories
    } = this.props
    fetchCategories()

    if (type === 'events') {
      let startDate = formatEventDate()
      fetchEvents(startDate, undefined, treshold)
    } else {
      let category = categories.find(cat => (cat.slug === type))
      if (type && category) {
        if (category && category.id) {
          fetchByCategory(category.id, treshold)
        } else {
          console.log(`Error: category ${type} not found`)
        }
      }
    }
    fetchPosts(treshold)
  }

  getInitialData = () => {
    const {
      fetchPosts,
      fetchByCategory,
      fetchCategories,
      fetchEvents,
      posts,
      type,
      data,
      categories
    } = this.props
    if (!categories || categories.length === 0) {
      fetchCategories()
    }

    if (type === 'events' && !data || !data[`00`] || !data[`00`].length === 0) {
      let startDate = formatEventDate()
      fetchEvents(startDate, undefined)
    } else {
      let category = categories.find(cat => (cat.slug === type))
      if (type && category && (!data[`${category.id}`] || data[`${category.id}`].length === 0)) {
        if (category && category.id) {
          console.log(`fetching for ${type}`)
          fetchByCategory(category.id)
        } else {
          console.log(`Error: category ${type} not found`)
        }
      }
    }
    if (posts.length === 0) fetchPosts()
  }

  refreshData = () => {
    const {
      fetchPosts,
      fetchByCategory,
      fetchEvents,
      type,
      categories,
    } = this.props
    if (type === 'events') {
      let startDate = formatEventDate()
      fetchEvents(startDate)
    } else {
      let category = categories.find(cat => (cat.slug === type))
      if (type && category) {
        if (category && category.id) {
          fetchByCategory(category.id)
          this.setState({
            refreshing: false,
          })
        } else {
          console.log(`Error: category ${type} not found`)
        }
      }
    }
    if (type === undefined) {
      fetchPosts()
    }
  }

  _keyExtractor = (item) => `_${item.id}`

  renderCardItem = ({ item }) => {
    const { categories, type } = this.props
    if (type === 'events') {
      // let categories = item.categories && item.categories.map(cat => (
    //     //{
    //     cat.name
    //     //slug: cat.slug, //TODO: filter by cats
    //  //}
    //   ))
      const descrItem = get(item, 'description', '')
      return (
        <CardEvent
          key={item.id}
          id={item.id}
          description={descrItem}
          smallDescription={descrItem.slice(0, 100).split('').join('')}
          title={item.title}
          dateStart={item.start_date} //utc_start_date
          dateEnd={item.end_date}
          image={get(item, `image.url`)}
          organizer={item.organizer} //array [0].organizer, url
          url={item.website}
          place={item.venue}
          slug={item.slug}
          allDay={item.allDay}
          categories={item.categories}
          tags={item.tags}
          cost={item.cost} //cost_details
          link={item.url}
        />
      )
    }
    const descrRendered = get(item, 'excerpt.rendered', '')
    const descrItem = get(item, 'description', '').replace(/<[^>]*>/g, '')
    return (
      <CardArticle
        key={item.id}
        id={item.id}
        data={item}
        link={item.link}
        title={item.title.rendered || item.title}
        descr={descrRendered.slice(0, 100).split('').join('') || descrItem.slice(0, 100).split('').join('')}
        mediaUrl={item.mediaUrl ? item.mediaUrl : null}
        categories={categories.filter(cat => (item.categories.includes(cat.id)))}
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
    const { posts, isLoading, type, data, categories, isPostOpen, postType } = this.props
    if (type === 'events') {

    }
    let category = categories.find(cat => (cat.slug === type))
    let displayingPosts = type ? (category ? data[`${category.id}`] : data[`00`]) : posts

    const dataWithMedia = displayingPosts && displayingPosts.map((item) => {
      const mediaUrl = get(item, '_links.wp:featuredmedia.href', null)
        || `https://hansanglab.com/wp-json/wp/v2/media/${get(item, 'featured_media')}`
      return {
        ...item,
        mediaUrl,
      }
    })

    return (
      <View style={{ position: 'relative', flex: 1 }}>
        {isPostOpen && this.renderPost(postType)}
        <FlatList
          data={dataWithMedia}
          style={{ flex: 1 }}
          renderItem={this.renderCardItem}
          onRefresh={this.refreshData}
          refreshing={isLoading}
          keyExtractor={this._keyExtractor}
          onEndReached={this.loadMoreData}
          removeClippedSubviews
          onEndReachedThreshold={5}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  postWrapper: {
    position: 'absolute',
    top: 0,
    paddingBottom: 100,
    left: 0,
    zIndex: 9,
    height,
    backgroundColor: '#EEEEEE',
    flex: 1,
  }
})

const mapStateFromProps = createStructuredSelector({
  isLoading: (state) => get(state, 'posts.isLoading'),
  isError: (state) => get(state, 'posts.isError'),
  posts: (state) => get(state, 'posts.posts'),
  data: (state) => get(state, 'posts.data'),
  categories: (state) => get(state, 'url.categories'),
  isPostOpen: (state) => get(state, 'url.isPostOpen'),
  postType: (state) => get(state, 'url.type'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPosts: (limit) => dispatch(getPosts(limit)),
  fetchByCategory: (cat, limit) => dispatch(getPostsByCategory(cat, limit)),
  fetchEvents: (startDate, endDate, limit) => dispatch(getEvents(startDate, endDate, limit)),
  fetchCategories: () => dispatch(getCategories()),
})

export default connect(
  mapStateFromProps,
  mapDispatchToProps,
)(AllPosts)
