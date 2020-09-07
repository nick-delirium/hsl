import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import HTML from 'react-native-render-html'
import InstagramEmbed from 'react-native-embed-instagram'
import { createStructuredSelector } from 'reselect'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { togglePost } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import { setData as setArticle, setRead } from '@/Pages/Posts/components/Articles/articleReducer'
import { setEvent } from '@/Pages/Posts/components/Events/eventReducer'
import findPost from '@/common/findPost'
import isEndReached from '@/common/isEndReached'
import api from '@/api'
import IframeRender from './IframeRender'
import CardArticle from './CardArticle'

const { width } = Dimensions.get('window')

class Article extends React.Component {
  componentDidMount() {
    this.refs._scrollRef.scrollTo({ x: 0, y: 0, animated: false })
  }

  onLinkPress = async (url) => {
    const { actions } = this.props
    if (url.startsWith('https://hansanglab.com')) {
      if (/wp-content/.test(url)) {
        return Linking.openURL(url)
      }
      try {
        const urlParts = url.split('/').filter(Boolean)
        const isEvent = urlParts[2] === 'event'
        const type = isEvent ? 'event' : 'article'
        const setAction = isEvent ? actions.setEvent : actions.setArticle
        const slug = urlParts[urlParts.length - 1]
        const fetchUrl = isEvent ? api.getEventBySlug(slug) : api.getPostBySlug(slug)
        await findPost(type, fetchUrl, setAction, actions.togglePost, 'internal_link')
      } catch (e) {
        console.log(e)
        this.onRemoteUrlPress(url)
      }
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
      similar,
    } = article
    const contentWithSpaces = content
      .replace(/<span class="symbols">.?<\/span>/g, ' ')
      .replace(/<iframe/, '<iframe allowfullscreen frameBorder="0" ')
    const videoContent = contentWithSpaces
      .replace(/<span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start">.*<\/span>/g, '')

    const contentWithoutEmbed = videoContent
      .replace(/(<script.*script>)|(<blockquote class="instagram(.|\n)*?<\/blockquote>)/gm, '')
      .replace(/<figure>/, '')
      .replace(/<\/figure>/, '')
      .replace(/<a id="embed" style="display: none"([^<]+)<\/a>/g, '<inst $1 />')

    const getDescrRendered = (item) => get(item, 'excerpt.rendered', '')
      .replace(/<[^>]*>/g, '')
      .slice(0, 100)
      .split('')
      .join('')

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
              baseFontStyle={styles.title}
              html={title}
            />
          </View>
          <HTML
            renderers={{
              inst: ({ href }) => {
                const postLink = href.slice(28).replace('/', '')
                return (
                  <InstagramEmbed
                    showAvatar
                    showCaption
                    id={postLink}
                    style={{ width: width - 50, marginTop: 20, marginLeft: -60 }}
                  />
                )
              },
              iframe: (atrs) => (
                <IframeRender
                  atrs={atrs}
                  onRemoteUrlPress={this.onRemoteUrlPress}
                  styles={styles}
                />
              ),
            }}
            html={`<div>${contentWithoutEmbed}</div>`}
            imagesMaxWidth={Dimensions.get('window').width - 50}
            onLinkPress={(e, url) => this.onLinkPress(url)}
            containerStyles={{ flex: 1, maxWidth: width - 50 }}
            tagsStyles={HTMLStyles}
            ignoredStyles={['fontFamily', 'font-family', 'width', 'height']}
          />
          {similar && similar.length > 0 && (
            <>
              <View style={styles.titleWrap}>
                <Text style={styles.title}>Смотрите также:</Text>
              </View>
              {similar.map((item) => (
                <CardArticle
                  key={item.id}
                  id={item.id}
                  data={item}
                  link={item.link}
                  title={item.title.rendered || item.title}
                  descr={getDescrRendered(item)}
                  mediaUrl={
                    get(item, '_links.wp:featuredmedia.href', null)
                    || `https://hansanglab.com/wp-json/wp/v2/media/${get(item, 'featured_media')}`
                  }
                  // there is no content for similar posts
                  content={get(item, 'content.rendered')}
                />
              ))}
            </>
          )}
          {/* <View style={{ paddingLeft: 20 }}>
            {uniqLinks.map((link) => (
              <InstagramEmbed
                showAvatar
                showCaption
                id={link.replace('/?utm_source=ig_embed', '').slice(28)}
                style={{ width: '95%', marginTop: 20 }}
              />
            ))}
          </View> */}
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
  title: {
    fontWeight: 'bold',
    fontSize: 22,
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
  figure: {
    margin: 0,
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
