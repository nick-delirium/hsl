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
import { formatText, formatDate } from '@/common/format'

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
    } = this.props
    const newPath = 'event/' + event.slug
    setEvent(event)
    history.push(newPath)
    changeLoc(path)
  }

  render () {
    const { id, title, description, dateStart, dateEnd, image, allDay } = this.props
    //TODO receive slug
    const startDate = formatDate(dateStart) 
    const endDate = formatDate(dateEnd)
    return (
    <TouchableOpacity onPress={() => this.onItemPress(this.props)}> 
      <View style={styles.card}>

      {image && (
        <CachedImage
          source={image}
          streight
          title={id}
          categories={undefined}
          style={{flex: 1, height: 190, borderBottomWidth: 1, borderColor: '#000'}}
        />
      )}
      <View style={styles.cardText} >
        <Text style={{fontWeight: 'bold', fontSize: 18, paddingBottom: 4}}>{title}</Text>
        <Text style={{fontSize: 14}}>{formatText(description)}</Text>
        
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
    marginBottom: 15,
    marginRight: 15,
    marginLeft: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
  },
  cardText: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingBottom: 15,
    paddingRight: 15,
    fontSize: 18,
  },
  category: {
    padding: 7,
    marginLeft: 10,
    fontSize: 12,
    backgroundColor: '#000',
    borderRadius: 2,
    color: '#fff',
    alignSelf: 'flex-start',
    top: -180,
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
})

const withConnect = connect(()=>({}), mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(CardEvent)
