import React from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { OptimizedFlatList } from 'react-native-optimized-flatlist'
import CardArticle from './components/Articles/CardArticle.js'
import CardEvent from './components/Events/CardEvent'
import { getPosts, getPostsByCategory, getEvents } from './reducer'
import { getCategories } from '@/Navigation/reducer'
import pages from '@/constants/pages'


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
      fetchEvents('2019-06-17%2000:00:00', undefined, treshold) //TODO: get and format current
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
      fetchEvents('2019-06-17%2000:00:00', undefined) //TODO: get and format current
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
      fetchEvents('2019-06-17%2000:00:00') //TODO: get and format current
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
      return (
        <CardEvent
          key={item.id}
          id={item.id}
          description={item.description}
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
        />
      )
    }
    return (
      <CardArticle
        key={item.id}
        id={item.id}
        data={item}
        title={item.title.rendered}
        descr={item.excerpt.rendered || item.description}
        mediaUrl={item.mediaUrl ? item.mediaUrl : null}
        categories={categories.filter(cat => (item.categories.includes(cat.id)))}
        content={get(item, 'content.rendered')}
        type={type}
      />
    )
  }

  render() {
    const { posts, isLoading, type, data, categories } = this.props
    if (type === 'events') {

    }
    let category = categories.find(cat => (cat.slug === type))
    let displayingPosts = type ? (category ? data[`${category.id}`] : data[`00`]) : posts
    const headerText = type ? pages[type].name : 'KORYOSARAM SYNERGY'
    
    const dataWithMedia = displayingPosts && displayingPosts.map((item) => {
      const mediaUrl = get(item, '_links.wp:featuredmedia.href', null) 
        || `https://hansanglab.com/wp-json/wp/v2/media/${get(item, 'featured_media')}`
      return {
        ...item,
        mediaUrl,
      }
    })
    return (
      <View>
        <OptimizedFlatList
          data={dataWithMedia}
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
  header: {
    fontSize: 20
  },
})

const mapStateFromProps = createStructuredSelector({
  isLoading: (state) => get(state, 'posts.isLoading'),
  isError: (state) => get(state, 'posts.isError'),
  posts: (state) => get(state, 'posts.posts'),
  data: (state) => get(state, 'posts.data'),
  categories: (state) => get(state, 'url.categories'),
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