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
import { createStructuredSelector } from 'reselect'
import HTMLView from 'react-native-htmlview';
import Dimensions from 'Dimensions'
import { changeLocation } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import { formatText, formatDate } from '@/common/format'

class Event extends React.Component {
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
              style={{ width, height: 200, borderBottomWidth: 1, borderColor: '#000'}}
            />
          )}
          <Text style={styles.title}>{title}</Text>
          <HTMLView
            value={`<div>${description.replace(/(\r\n|\n|\r)/gm, "")}</div>`}
            stylesheet={HTMLStyles}

            onLinkPress={(url) => {this.onLinkPress(url)}}
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
              <Text style={{ flex: 0.9 }}>{url}</Text>
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
  event: (state) => get(state, 'event')
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(Event)
