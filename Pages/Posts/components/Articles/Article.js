import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
  Dimensions,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import HTML from 'react-native-render-html'
import { createStructuredSelector } from 'reselect'
import { changeLocation } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import { setData } from './articleReducer'


const { width } = Dimensions.get('window')

class Article extends React.PureComponent {
  componentDidMount() {
    this.refs._scrollRef.scrollTo({ x: 0, y: 0, animated: false })
  }

  onLinkPress = (url) => {
    const { setPost, allPosts } = this.props
    // TODO: fetch exact post instead of search by allPosts
    const found = allPosts.find((post) => (post.link === url))

    // TODO: load events
    // if (url.startsWith('https://hansanglab.com')) {
    //   urlParts = url.split('/')
    //   if (urlParts[3] === 'event') {
    //     let newPath = `${urlParts[3]}/${urlParts[4]}`
    //   }
    // }

    if (found) {
      const article = {
        title: found.title.rendered,
        link: found.link,
        mediaUrl: found.mediaUrl,
        id: found.id,
        categories: found.categories,
        content: found.content,
      }

      // const newPath = `post/${found.id}`
      setPost(article)
      // history.push(newPath)
      // changeLoc(newPath)
    } else {
      Linking.openURL(url)
    }
  }

  onRemoteUrlPress = (url) => Linking.openURL(url)

  render() {
    const {
      // match: { params: { id } },
      article,
    } = this.props
    const { OS } = Platform
    // eslint-disable-next-line camelcase
    const is_iOS = OS === 'ios'
    const {
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
          <Text
            style={{
              fontWeight: 'bold',
              paddingRight: 20,
              paddingLeft: 20,
              fontSize: 22,
              marginBottom: 15,
              marginTop: 15,
            }}
          >
            {title}
          </Text>
          <HTML
            renderers={{
              iframe: (atrs) => {
                const videoId = atrs.src.split('/')[4]
                const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`
                // eslint-disable-next-line camelcase
                if (is_iOS) {
                  return (
                    <WebView
                      key={videoId}
                      source={{ uri: atrs.src }}
                      style={styles.videoFrameContainer}
                    />
                  )
                }
                return (
                  <TouchableOpacity
                    key={videoId}
                    style={styles.videoFrameContainer}
                    onPress={() => this.onRemoteUrlPress(atrs.src)}
                  >
                    <Image source={{ uri: thumbnail }} style={styles.videoFrameContainer} />
                    <Image
                      source={require('@/assets/images/youtube-play-btn.png')}
                      style={{ position: 'absolute', top: (0.56 * (width - 40) - 56) / 2, right: (width - 40 - 80) / 2 }}
                    />
                  </TouchableOpacity>
                )
              },
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
  changeLoc: (path) => dispatch(changeLocation(path)),
  setPost: (article) => dispatch(setData(article)),
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
