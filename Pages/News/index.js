import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Article from './components/Article.js'
import { getPosts } from './reducer'

class News extends React.Component {
  componentDidMount() {
    const { fetchPosts } = this.props
    fetchPosts(20)
  }

  render() {
    const { posts, isLoading } = this.props
    return (
      <View>
        <Text style={styles.header}>News</Text>
        {isLoading && (
          <Text>Загрузка</Text>
        )}
        {posts && posts.map((item, i) => {
          let mediaUrl = item._links['wp:attachment'] && item._links['wp:attachment'][0] && item._links['wp:attachment'][0].href
          return (
          <Article 
            key={i} 
            data={item}
            title={item.title.rendered}
            descr={item.excerpt.rendered}
            mediaUrl={mediaUrl ? mediaUrl : null}
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
})

const mapDispatchToProps = (dispatch) => ({
  fetchPosts: (limit) => dispatch(getPosts(limit))
})

export default connect(
  mapStateFromProps,
  mapDispatchToProps, 
)(News)
