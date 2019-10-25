import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native'
import { Linking } from 'expo'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import CachedImage from '@/components/CachedImage'
import { changeLocation, togglePost } from '@/Navigation/reducer'
import { setEvent } from './eventReducer'
import { formatDate } from '@/common/format'
import fonts from '@/constants/Styles'
import Card from '@/components/Card'

class CardEvent extends React.Component {
  onItemPress = async () => {
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
      link,
      allDay,
      actions,
    } = this.props
    const event = {
      id,
      title,
      description,
      dateStart,
      dateEnd,
      link,
      image,
      organizer,
      url,
      place,
      allDay,
    }
    // const newPath = 'event/' + event.slug
    try {
      const inAppLink = await Linking.makeUrl('redirect', { type: `event|${id}` })
      actions.setEvent({ ...event, inAppLink })
      actions.openPost(true, 'event')
    } catch (e) {
      console.error(e)
    }
    // history.push(newPath)
    // changeLoc(path)
  }

  render() {
    const {
      id,
      title,
      smallDescription,
      // description,
      dateStart,
      dateEnd,
      image,
      allDay,
    } = this.props
    // TODO receive slug
    const startDate = formatDate(dateStart)
    const endDate = formatDate(dateEnd)
    if (!startDate) return null
    return (
      <Card onItemPress={this.onItemPress}>
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
        <View style={styles.cardText}>
          <Text style={{ fontWeight: 'bold', fontSize: fonts.big, paddingBottom: 4 }}>{title}</Text>
          <Text style={{ fontSize: fonts.normal, lineHeight: 18 }}>
            {smallDescription}
            ...
          </Text>

          <View
            style={{
              ...styles.row, justifyContent: 'space-between', paddingTop: 10, paddingBottom: 20,
            }}
          >
            <View style={{ ...styles.row, flex: 1 }}>
              <Image
                source={require('@/assets/images/calendar-circle-icon.png')}
                style={{ height: 30, width: 30, marginRight: 10 }}
              />
              <View>
                <Text style={{ color: '#525252' }}>
                  {startDate ? `${startDate.date} - ${endDate.date}` : ''}
                </Text>
              </View>
            </View>
            {allDay && (
              <View style={{ ...styles.row, flex: 1.5 }}>
                <Image
                  source={require('@/assets/images/time-circle-icon.png')}
                  style={{ height: 30, width: 30, marginRight: 5 }}
                />
                <View>
                  <Text style={{ color: '#525252' }}>
                    {`${startDate.time} - ${endDate.time}`}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
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
  actions: {
    changeLoc: (path) => dispatch(changeLocation(path)),
    setEvent: (event) => dispatch(setEvent(event)),
    openPost: (isOpen, type) => dispatch(togglePost(isOpen, type)),
  },
})

const withConnect = connect(() => ({}), mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(CardEvent)
