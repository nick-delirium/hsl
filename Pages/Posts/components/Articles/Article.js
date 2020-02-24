import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import HTML from 'react-native-render-html'
import { createStructuredSelector } from 'reselect'
import * as WebBrowser from 'expo-web-browser'
import { togglePost } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import { setData as setArticle, setRead } from '@/Pages/Posts/components/Articles/articleReducer'
import { setEvent } from '@/Pages/Posts/components/Events/eventReducer'
import findPost from '@/common/findPost'
import isEndReached from '@/common/isEndReached'
import api from '@/api'
import IframeRender from './IframeRender'

const { width } = Dimensions.get('window')

class Article extends React.Component {
  componentDidMount() {
    this.refs._scrollRef.scrollTo({ x: 0, y: 0, animated: false })
  }

  onLinkPress = async (url) => {
    const { actions } = this.props
    if (url.startsWith('https://hansanglab.com')) {
      const urlParts = url.split('/').filter(Boolean)
      const isEvent = urlParts[2] === 'event'
      const type = isEvent ? 'event' : 'article'
      const setAction = isEvent ? actions.setEvent : actions.setArticle
      const slug = urlParts[urlParts.length - 1]
      const fetchUrl = isEvent ? api.getEventBySlug(slug) : api.getPostBySlug(slug)
      findPost(type, fetchUrl, setAction, actions.togglePost, true)
    } else {
      this.onRemoteUrlPress(url)
    }
  }

  onRemoteUrlPress = async (url) => {
    if (url.startsWith('mailto:')) {
      Linking.openURL(url)
    } else {
      await WebBrowser.openBrowserAsync(url)
    }
  }

  render() {
    const {
      article,
      actions,
    } = this.props
    const {
      id,
      title,
      content: {
        rendered: content,
      },
      mediaUrl,
    } = article
    const contentWithSpaces = content
      .replace(/<span class="symbols">.?<\/span>/g, ' ')
      .replace(/<br.?\/>/, '')
      .replace(/<iframe/, '<iframe allowfullscreen frameBorder="0" ')
    const videoContent = contentWithSpaces
      .replace(/<span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start">.*<\/span>/g, '')
    return (
      <ScrollView
        ref="_scrollRef"
        contentContainerStyle={styles.scrollView}
        onScroll={({ nativeEvent }) => {
          if (isEndReached(nativeEvent) && !article.isRead) {
            actions.setRead(id, 'post')
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={{ ...styles.card }}>
          {mediaUrl && (
            <CachedImage
              source={mediaUrl}
              title={mediaUrl.slice(-4)}
              categories={undefined}
              style={{ height: 200 }}
            />
          )}
          <View style={styles.titleWrap}>
            <HTML
              baseFontStyle={{
                fontWeight: 'bold',
                fontSize: 22,
              }}
              html={title}
            />
          </View>
          <HTML
            renderers={{
              iframe: (atrs) => (
                <IframeRender
                  atrs={atrs}
                  onRemoteUrlPress={this.onRemoteUrlPress}
                  styles={styles}
                />
              ),
            }}
            html={`<div>${videoContent}</div>`}
            imagesMaxWidth={Dimensions.get('window').width - 50}
            onLinkPress={(e, url) => this.onLinkPress(url)}
            containerStyles={{ flex: 1, maxWidth: width - 50 }}
            tagsStyles={HTMLStyles}
            ignoredStyles={['fontFamily', 'font-family', 'width', 'height']}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 0,
    flexGrow: 1,
    width,
  },
  videoFrameContainer: {
    height: (width - 40) * 0.56,
    width: width - 40,
  },
  card: {
    marginRight: 0,
    flex: 1,
    marginLeft: 0,
    backgroundColor: '#fff',
    paddingBottom: 30,
  },
  titleWrap: {
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 15,
    marginTop: 15,
  },
})
const HTMLStyles = StyleSheet.create({
  div: {
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 0,
    marginBottom: 5,
  },
  blockquote: {
    backgroundColor: '#f8f8f8',
    borderLeftColor: '#fa5742',
    borderLeftWidth: 2,
    padding: 10,
    marginBottom: 10,
  },
  iframe: {
    width: width - 40,
  },
  li: {
    marginTop: 0,
  },
  ul: {
    marginTop: 0,
    marginBottom: 10,
  },
  p: {
    marginBottom: 20,
    lineHeight: 20,
  },
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    setRead: (id) => dispatch(setRead(id)),
    setArticle: (article) => dispatch(setArticle(article)),
    setEvent: (event) => dispatch(setEvent(event)),
    togglePost: (isOpen, type) => dispatch(togglePost(isOpen, type)),
  },
})

const mapStateToProps = createStructuredSelector({
  path: (state) => get(state, 'url.path'),
  allPosts: (state) => get(state, 'posts.posts'),
  article: (state) => get(state, 'article'),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(Article)
