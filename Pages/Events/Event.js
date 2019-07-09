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
import { changeLocation } from '../../Navigation/reducer'
import { createStructuredSelector } from 'reselect'
import HTMLView from 'react-native-htmlview';
import CachedImage from '../../components/CachedImage'
import { formatText, formatDate } from '../../common/format'
import Dimensions from 'Dimensions'


class Event extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.refs._scrollRef.scrollTo({ x: 0, y: 0, animated: false })
  }

  onLinkPress = (url) => {
    let found = this.props.allPosts.find(post => (post.link === url))
    console.log(found)
    if (found) {
      this.props.history.push(`post/${found.id}`)
      this.props.changeLoc(path)
    }
  }

  render () {
    const { 
      match: { params: { slug } }, 
      allPosts,
      event,
    } = this.props
  
    const { id, title, description, dateStart, dateEnd, image, organizer, url, place, allDay } = event
    const { width, height } = Dimensions.get('window')
    let startDate = formatDate(dateStart) 
    let endDate = formatDate(dateEnd)
    console.log('aaaaa', !!url)
    return (
      <ScrollView ref='_scrollRef' contentContainerStyle={styles.scrollview}>
        <View style={styles.description}>
          {image && (
            <CachedImage
              source={image}
              title={id}
              categories={undefined}
              streight
              style={{ width, minHeight: 200, borderBottomWidth: 1, borderColor: '#000'}}
            />
          )}
          <Text style={styles.title}>{title}</Text>
          <HTMLView
            value={`<div>${description.replace(/(\r\n|\n|\r)/gm, "")}</div>`}
            stylesheet={HTMLStyles}

            onLinkPress={(url) => {this.onLinkPress(url); console.log('clicked link: ', url)}}
          />
        </View>
        <View style={styles.card}>
        
          <View style={{...styles.row, paddingtop: 16,}}>
              <Image source={require('../../assets/images/calendar-icon.png')} style={styles.icon}/>
              <Text>{`${startDate.date} - ${endDate.date}`}</Text>
          </View>
          {allDay && (
            <View style={styles.row}>
              <Image source={require('../../assets/images/time-icon.png')} style={styles.icon}/>
              <Text>{`${startDate.time} - ${endDate.time}`}</Text>
            </View>
          )}
          {!!url && url.length &&(
            <View style={styles.row}>
              <Image source={require('../../assets/images/desktop-icon.png')} style={styles.icon}/>
              <Text style={{flex: 0.9}}>{url}</Text>
            </View>
          )}

          {place && place.venue && (
            <View style={styles.row}>
              <Image source={require('../../assets/images/place-icon.png')} style={styles.icon}/>
              <View style={{flex: 0.9}}>
                <Text>{place.venue}</Text>
                {place.address && <Text>{place.address}</Text>}
                {place.city && place.country && <Text>{`${place.city}, ${place.country}`}</Text>}
                </View>
            </View>
          )}
          {organizer[0] && (
            <View style={styles.row}>
              <Image source={require('../../assets/images/human-icon.png')} style={styles.icon}/>
              <Text style={{flex: 0.9}}>{organizer[0].organizer}</Text>
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
    flex: 1,
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
