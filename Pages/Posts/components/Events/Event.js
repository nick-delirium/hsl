import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Linking,
} from 'react-native'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import HTML from 'react-native-render-html'
import Dimensions from 'Dimensions'
import { changeLocation } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import { formatDate } from '@/common/format'

class Event extends React.PureComponent {
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
      // history.push(newPath)
      // changeLoc(newPath)
    } else {
      Linking.openURL(url)
    }
  }

  render () {
    const {
      match: { params: { slug } }, // todo use slug
      event,
    } = this.props

    const { id, title, description, dateStart, dateEnd, image, organizer, url, place, allDay } = event
    const { width } = Dimensions.get('window')
    const startDate = formatDate(dateStart)
    const endDate = formatDate(dateEnd)
    return (
      <ScrollView ref='_scrollRef' contentContainerStyle={styles.scrollview}>
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
          <Text style={styles.title}>{title}</Text>
          <HTML
            html={`<div>${description}</div>`}
            tagsStyles={HTMLStyles}
            containerStyles={{ flex: 1, maxWidth: width - 50}}
            imagesMaxWidth={Dimensions.get('window').width - 50}
            onLinkPress={(e, url) => {this.onLinkPress(url)}}
            alterChildren={node => {
              if (node.name === 'iframe') {
                delete node.attribs.width
                delete node.attribs.height
              }
            }}
            ignoredStyles={['fontFamily', 'font-family', 'width', 'height']}
          />
        </View>
        <View style={styles.card}>

          <View style={{...styles.row, paddingtop: 16,}}>
              <Image source={require('@/assets/images/calendar-icon.png')} style={styles.icon}/>
              <Text style={{ flex: 0.9 }}>{`${startDate.date} - ${endDate.date}`}</Text>
          </View>
          {allDay && (
            <View style={styles.row}>
              <Image source={require('@/assets/images/time-icon.png')} style={styles.icon}/>
              <Text style={{ flex: 0.9 }}>{`${startDate.time} - ${endDate.time}`}</Text>
            </View>
          )}
          {!!url && url.length &&(
            <View style={styles.row}>
              <Image source={require('@/assets/images/desktop-icon.png')} style={styles.icon}/>
              <Text onPress={() => this.onLinkPress(url)} style={{ flex: 0.9, color: 'blue' }}>{url}</Text>
            </View>
          )}

          {place && place.venue && (
            <View style={styles.row}>
              <Image source={require('@/assets/images/place-icon.png')} style={styles.icon}/>
              <View style={{ flex: 0.9 }}>
                <Text>{place.venue}</Text>
                {place.address && <Text>{place.address}</Text>}
                {place.city && place.country && <Text>{`${place.city}, ${place.country}`}</Text>}
                </View>
            </View>
          )}

          {organizer[0] && (
            <View style={styles.row}>
              <Image source={require('@/assets/images/human-icon.png')} style={styles.icon}/>
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
    shadowOffset: {width: 0, height: 4},
    paddingTop: 18,
    paddingBottom: 30,
    paddingRight: 18,
    paddingLeft: 18,
  },
  icon: {
    flex: 0.1,
    width: null,
    height: 20,
    resizeMode: 'contain'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
  description: {
    paddingBottom: 30,
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
  changeLoc: (path) => dispatch(changeLocation(path))
})

const mapStateToProps = createStructuredSelector({
  path: (state) => get(state, 'url.path'),
  allPosts: (state) => get(state, 'posts.posts'),
  event: (state) => get(state, 'event')
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(Event)
