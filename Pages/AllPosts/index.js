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

class AllPosts extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { 
      fetchPosts, 
      fetchNews,
      fetchCategories, 
      posts, 
      onlyNews, 
      data, 
      categories
    } = this.props
    if (onlyNews && data.length === 0) fetchNews()
    if (posts.length === 0) fetchPosts()
    if (!categories || categories.length === 0) {
      fetchCategories()
    }
  }

  render() {
    const { posts, isLoading, onlyNews, data, categories } = this.props
    let displayingPosts = onlyNews ? data : posts

    return (
      <View>
        {!onlyNews && <Text style={styles.header}>Все</Text>}
        {isLoading && <Text>Загрузка</Text>}
        {displayingPosts && displayingPosts.map((item, i) => {
          const mediaUrl = get(item, `_links.wp:featuredmedia.href`) || 'https://hansanglab.com/wp-json/wp/v2/media/' +get(item, 'featured_media')

          // const mediaUrl = get(item, `_links.wp:attachment[0].href`)
          console.log(mediaUrl)
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
  fetchNews: (limit) => dispatch(getPostsByCategory(3, limit)), //TODO: map categories
  fetchCategories: () => dispatch(getCategories()),
})

export default connect(
  mapStateFromProps,
  mapDispatchToProps, 
)(AllPosts)
