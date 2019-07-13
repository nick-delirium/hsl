import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Linking,
  Image,
} from 'react-native'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import Dimensions from 'Dimensions'
import HTMLView from 'react-native-htmlview'
import { createStructuredSelector } from 'reselect'
import { changeLocation } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import { setData } from './articleReducer'

class Article extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.refs._scrollRef.scrollTo({ x: 0, y: 0, animated: false })
  }

  onLinkPress = (url) => {
    const { history, changeLoc, setPost } = this.props
    let found = this.props.allPosts.find(post => (post.link === url))

    if (found) {
      const article = {
        title: found.title.rendered,
        mediaUrl: found.mediaUrl,
        id: found.id,
        categories: found.categories,
        content: found.content,
      }

      const newPath = `post/${found.id}`
      setPost(article)
      history.push(newPath)
      changeLoc(newPath)
    } else {
      if (!/hansanglab/.test(url)) Linking.openURL(url)
    }
  }

  render () {
    const { 
      match: { params: { id } }, 
      article,
    } = this.props
  
    // const post = allPosts.find(a => (a.id == id))
    // const content = get(post, 'content.rendered')
    // const title = get(post, 'title.rendered')

    const { title, content: { rendered: content }, mediaUrl, categories } = article
    return (
      <ScrollView ref='_scrollRef' contentContainerStyle={styles.scrollView}>
        <View style={{ ...styles.card }}>
          <Text 
            style={{ 
              fontWeight: 'bold', 
              paddingRight: 20, 
              paddingLeft: 20, 
              fontSize: 22,
              marginBottom: 15,
            }}
          >
            {title}
          </Text>
          {mediaUrl && (
            <CachedImage
              source={mediaUrl}
              title={id}
              categories={categories[0] ? categories[0] : undefined}
              style={{ flex: 1, height: 200, borderBottomWidth: 1, borderColor: '#000' }}
            />
          )}
          <HTMLView
            style={{ paddingTop: 10 }}
            value={`<div>${content.replace(/(\r\n|\n|\r)/gm, "")}</div>`}
            stylesheet={HTMLStyles}
            onLinkPress={(url) => {this.onLinkPress(url)}}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 0,
  },
  card: {
    marginRight: 0,
    flex: 1,
    marginLeft: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
    paddingTop: 18,
    paddingBottom: 30,
  }
})
const HTMLStyles = StyleSheet.create({
  div: {
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 0,
    marginBottom: 0,
  },
  li: {
    marginTop: 0,
  },
  ul: {
    marginTop: 0,
    marginBottom: 0,
  },
  p: {
    marginBottom: 10,
    paddingBottom: 10,
  },
})

const mapDispatchToProps = (dispatch) => ({
  changeLoc: (path) => dispatch(changeLocation(path)),
  setPost: (article) => dispatch(setData(article)),
})

const mapStateToProps = createStructuredSelector({
  path: (state) => get(state, 'url.path'),
  allPosts: (state) => get(state, 'posts.posts'),
  article: (state) => get(state, 'article')
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(Article)