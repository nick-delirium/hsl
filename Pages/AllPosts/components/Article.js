import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { changeLocation } from '../../../Navigation/reducer'
import { createStructuredSelector } from 'reselect'
import HTMLView from 'react-native-htmlview';

class Article extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.refs._scrollRef.scrollTo({ x: 0, y: 0, animated: false })
  }

  onLinkPress = (url) => {
    let found = this.props.allPosts.find(post => (post.link === url))
    if (found) {
      this.props.history.push(`post/${found.id}`)
      this.props.changeLoc(path)
    }
  }

  render () {
    const { 
      match: { params: { id } }, 
      allPosts,
      article,
    } = this.props
  
    // const post = allPosts.find(a => (a.id == id))
    // const content = get(post, 'content.rendered')
    // const title = get(post, 'title.rendered')

    const { title, content: { rendered: content }, imgUrl } = article
    return (
      <ScrollView ref='_scrollRef' contentContainerStyle={styles.scrollview}>
        <View style={styles.card}>
          <Text style={{fontWeight: 'bold'}}>{title}</Text>
          {imgUrl && <Image style={{flex: 1, height: 140}} source={{uri: imgUrl}}/>}
          <HTMLView
            value={`<div>${content.replace(/(\r\n|\n|\r)/gm, "")}</div>`}
            stylesheet={HTMLStyles}

            onLinkPress={(url) => console.log('clicked link: ', url)}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollview: {
    padding: 20,
  },
  card: {
    marginBottom: 30,
    marginRight: 0,
    marginLeft: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
    paddingTop: 18,
    paddingBottom: 30,
    paddingRight: 18,
    paddingLeft: 18,
  }
})
const HTMLStyles = StyleSheet.create({
  div: {
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
  changeLoc: (path) => dispatch(changeLocation(path))
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
