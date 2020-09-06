/* eslint-disable no-param-reassign */
import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import HTML from 'react-native-render-html'
import { togglePost } from '@/Navigation/reducer'
import { setData as setArticle } from '@/Pages/Posts/components/Articles/articleReducer'
import { setEvent, setRead } from '@/Pages/Posts/components/Events/eventReducer'
import CachedImage from '@/components/CachedImage'
import { formatDate } from '@/common/format'
import findPost from '@/common/findPost'
import isEndReached from '@/common/isEndReached'
import api from '@/api'

class Event extends React.PureComponent {
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
        await findPost(type, fetchUrl, setAction, actions.togglePost, true)
      } catch (e) {
        console.log(e)
        await WebBrowser.openBrowserAsync(url)
      }
    } else if (url.startsWith('mailto:')) {
      Linking.openURL(url)
    } else {
      await WebBrowser.openBrowserAsync(url)
    }
  }

  render() {
    const {
      // match: { params: { slug } }, // todo use slug
      event,
      actions,
    } = this.props

    const {
      id,
      title,
      description,
      dateStart,
      dateEnd,
      image,
      organizer,
      url,
      place,
      allDay,
    } = event
    const { width } = Dimensions.get('window')
    const startDate = formatDate(dateStart)
    const endDate = formatDate(dateEnd)
    const oneDay = allDay || startDate.date === endDate.date
    const showTime = oneDay && startDate.time !== '00:00'

    return (
      <ScrollView
        ref="_scrollRef"
        contentContainerStyle={styles.scrollview}
        onScroll={({ nativeEvent }) => {
          if (isEndReached(nativeEvent) && !event.isRead) {
            actions.setRead(id, 'event')
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.description}>
          {image && (
            <CachedImage
              source={image}
              streight
              title={id}
              categories={undefined}
              style={{ width, height: 200 }}
            />
          )}
          <View style={styles.titleWrap}>
            <HTML
              baseFontStyle={styles.title}
              html={title}
            />
          </View>

          <HTML
            html={`<div>${description}</div>`}
            tagsStyles={HTMLStyles}
            containerStyles={{ flex: 1, maxWidth: width - 50 }}
            imagesMaxWidth={Dimensions.get('window').width - 50}
            onLinkPress={(e, uri) => { this.onLinkPress(uri) }}
            alterChildren={(node) => {
              if (node.name === 'iframe') {
                delete node.attribs.width
                delete node.attribs.height
              }
            }}
            ignoredStyles={['fontFamily', 'font-family', 'width', 'height']}
          />
        </View>
        <View style={styles.card}>

          <View style={{ ...styles.row, paddingtop: 16 }}>
            <Image source={require('@/assets/images/calendar-icon.png')} style={styles.icon} />
            <Text style={{ flex: 0.9 }}>
              {`${startDate.date}${!oneDay ? (`- ${endDate.date}`) : ''}`}
            </Text>
          </View>
          {showTime && (
            <View style={styles.row}>
              <Image source={require('@/assets/images/time-icon.png')} style={styles.icon} />
              <Text style={{ flex: 0.9 }}>{`${startDate.time} - ${endDate.time}`}</Text>
            </View>
          )}
          {!!url && url.length && (
            <View style={styles.row}>
              <Image source={require('@/assets/images/desktop-icon.png')} style={styles.icon} />
              <Text onPress={() => this.onLinkPress(url)} style={{ flex: 0.9, color: 'blue' }}>{url}</Text>
            </View>
          )}

          {place && place.venue && (
            <View style={styles.row}>
              <Image source={require('@/assets/images/place-icon.png')} style={styles.icon} />
              <View style={{ flex: 0.9 }}>
                <Text>{place.venue}</Text>
                {place.address && <Text>{place.address}</Text>}
                {place.city && place.country && <Text>{`${place.city}, ${place.country}`}</Text>}
              </View>
            </View>
          )}

          {organizer[0] && (
            <View style={styles.row}>
              <Image source={require('@/assets/images/human-icon.png')} style={styles.icon} />
              <Text style={{ flex: 0.9 }}>{organizer[0].organizer}</Text>
            </View>
          )}

        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollview: {
    padding: 0,
    flexGrow: 1,
  },
  card: {
    flex: 1,
    marginRight: 0,
    marginLeft: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    paddingTop: 18,
    paddingBottom: 30,
    paddingRight: 18,
    paddingLeft: 18,
  },
  icon: {
    flex: 0.1,
    width: null,
    height: 20,
    resizeMode: 'contain',
  },
  titleWrap: {
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 15,
    marginTop: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
  },
  description: {
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: 16,
  },
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
    paddingBottom: 20,
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
  event: (state) => get(state, 'event'),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(Event)
