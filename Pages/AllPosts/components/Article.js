import React from 'react'
import {
  StyleSheet,
  View,
  Text,
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
    console.log(content)
    return (
      <View style={styles.card}>

        <View style={styles.cardText}>
          <Text style={{fontWeight: 'bold'}}>{title}</Text>
          {imgUrl && <Image style={{flex: 1, height: 140}} source={{uri: imgUrl}}/>}
          <HTMLView
            value={content}
            stylesheet={styles}
            onLinkPress={(url) => console.log('clicked link: ', url)}
        />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    marginRight: 0,
    marginLeft: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
  },
  cardText: {
    paddingTop: 18,
    paddingRight: 18,
    paddingLeft: 18,
  },
  
  p: {
    paddingBottom: 0,
    paddingTop: 0,
    padding: 0,
    marginBottom: 0,
    marginTop: 0,
    textIndent: 10, 
  }
  
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
