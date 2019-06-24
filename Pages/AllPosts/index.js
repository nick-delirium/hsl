import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import CardArticle from './components/CardArticle.js'
import { getPosts, getPostsByCategory } from './reducer'
import { getCategories } from '../../Navigation/reducer'
import pages from '../../constants/pages'

class AllPosts extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { 
      fetchPosts,
      fetchByCategory,
      fetchCategories,
      posts,
      type,
      data,
      categories
    } = this.props

    if (!categories || categories.length === 0) {
      fetchCategories()
    }
    let category = categories.find(cat => (cat.slug === type))
    if (type && category && (!data[`${category.id}`] || data[`${category.id}`].length === 0)) {
      if (category && category.id) {
        // console.log(`fetching for ${type}`)
        fetchByCategory(category.id)
      } else {
        console.log(`Error: category ${type} not found`)
      }
    }
    if (posts.length === 0) fetchPosts()
  }

  render() {
    const { posts, isLoading, type, data, categories } = this.props
    let category = categories.find(cat => (cat.slug === type))
    let displayingPosts = type ? data[`${category.id}`] : posts
    const headerText = type ? pages[type].name : 'KORYOSARAM SYNERGY'

    return (
      <View>
        {<Text style={styles.header}>{headerText}</Text>}
        {isLoading && <Text>Загрузка</Text> /* TODO: add loader */}
        {displayingPosts && displayingPosts.map((item, i) => {
          const mediaUrl = get(item, `_links.wp:featuredmedia.href`) || 'https://hansanglab.com/wp-json/wp/v2/media/' +get(item, 'featured_media')

          // const mediaUrl = get(item, `_links.wp:attachment[0].href`)
          return (
            <CardArticle
              key={item.id}
              id={item.id}
              data={item}
              title={item.title.rendered}
              descr={item.excerpt.rendered}
              mediaUrl={mediaUrl ? mediaUrl : null}
              categories={categories.filter(cat => (item.categories.includes(cat.id)))}
              content={item.content.rendered}
            />
          )
        })}
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
  fetchByCategory: (cat, limit) => dispatch(getPostsByCategory(cat, limit)), //TODO: map categories
  fetchCategories: () => dispatch(getCategories()),
})

export default connect(
  mapStateFromProps,
  mapDispatchToProps, 
)(AllPosts)
