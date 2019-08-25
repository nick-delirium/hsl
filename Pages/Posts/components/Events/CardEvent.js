import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import CachedImage from '@/components/CachedImage'
import { changeLocation } from '@/Navigation/reducer'
import { setEvent } from './eventReducer'
import { formatDate } from '@/common/format'
import { togglePost } from '@/Navigation/reducer'
import { fonts } from '@/constants/Styles'

class CardEvent extends React.Component {
constructor(props) {
    super(props)
    this.state = {
    imgUrl: null,
    isFetching: false,
    error: null,
    }
  }

  onItemPress = (event) => {
    const {
      setEvent,
      changeLoc,
      history,
      path,
      openPost,
    } = this.props
    const newPath = 'event/' + event.slug
    setEvent(event)
    // history.push(newPath)
    // changeLoc(path)
    openPost(true, 'event')
  }

  render () {
    const { id, title, smallDescription, description, dateStart, dateEnd, image, allDay } = this.props
    //TODO receive slug
    const startDate = formatDate(dateStart)
    const endDate = formatDate(dateEnd)
    return (
    <TouchableOpacity 
      delayPressIn={200}
      activeOpacity={0.6}
      onPress={() => this.onItemPress(this.props)}>
      <View style={styles.card}>

      {image && (
        <CachedImage
          source={image}
          streight
          title={id}
          categories={undefined}
          style={{
            flex: 1,
            height: 190,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        />
      )}
      <View style={styles.cardText} >
        <Text style={{fontWeight: 'bold', fontSize: fonts.big, paddingBottom: 4}}>{title}</Text>
        <Text style={{fontSize: fonts.normal, lineHeight: 18}}>
          {smallDescription}...
        </Text>

        <View style={{ ...styles.row, justifyContent: 'space-between', paddingTop: 10, paddingBottom: 20 }}>
          <View style={{...styles.row, flex: 1}}>
            <Image source={require('@/assets/images/calendar-circle-icon.png')}
              style={{ height: 30, width: 30, marginRight: 10 }}/>
            <View>
              <Text style={{color: '#525252'}}>
                {`${startDate.date} - ${endDate.date}`}
              </Text>
            </View>
          </View>
          {allDay && (
            <View style={{...styles.row, flex: 1.5}}>
              <Image source={require('@/assets/images/time-circle-icon.png')}
                style={{ height: 30, width: 30, marginRight: 5 }}
              />
              <View>
                <Text style={{color: '#525252'}}>
                  {`${startDate.time} - ${endDate.time}`}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
  )
  }
}

const styles = StyleSheet.create({
  card: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
  },
  cardText: {
    paddingLeft: 15,
    paddingBottom: 15,
    paddingRight: 15,
    paddingTop: 15,
    fontSize: fonts.big,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

const mapDispatchToProps = (dispatch) => ({
  changeLoc: (path) => dispatch(changeLocation(path)),
  setEvent: (event) => dispatch(setEvent(event)),
  openPost: (isOpen, type) => dispatch(togglePost(isOpen, type)),
})

const withConnect = connect(()=>({}), mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(CardEvent)
