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
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
// import CalendarIcon from '../../assets/images/CalendarIcon.svg'
// import { changeLocation } from '../../../Navigation/reducer' 
// import { setData } from '../../../Redux/articleReducer'

class CardEvent extends React.Component {
constructor(props) {
    super(props)
    this.state = {
    imgUrl: null,
    isFetching: false,
    error: null,
    }
  }

  componentDidMount() {
    if (this.props.mediaUrl) {
    fetch(this.props.mediaUrl)
        .then(response => response.json())
        .then(result => this.setState({ imgUrl: result && result.source_url, isFetching: false }))
        .catch(e => {
          console.error(e)
          this.setState({isFetching: false, error: e })
        })
    }
  }
  onItemPress = (id) => {
    const { 
      setPost, 
      changeLoc, 
      history, 
      path,
      title,
      data,
    } = this.props
    console.log(this.props)
    const { imgUrl } = this.state
    const newPath = 'post/' + id
    const article = {
      title,
      imgUrl,
      content: data.content,
    }
    // setPost(article)
    // history.push(newPath)
    // changeLoc(path)
  }
  formatText = (text) => {
    let newText = text.replace(/(<p>)/gm, "")
    // console.log(newText.split('<'))
    newText = newText.split('<')[0] + '...'
    return(newText)
  }

  formatDate = (date) => {
    if (!date) {
      return;
    }
    const months = {'01': "января", '02': "февраля", '03': "марта", '04': "апреля", '05': "мая", '06': "июня",
      '07': "июля", '08': "августа", '09': "сентября", '10': "октября", '11': "ноября", '12': "декабря"};
    date = date.split(' ')[0].split('-');
    let month = months[date[1]];
      return (`${date[2]} ${month}`)
  }

  render () {
    //organizer //array [0].organizer, url

    const { id, title, description, dateStart, dateEnd, image, organizer, url, place } = this.props
    // const { imgUrl } = this.state
    // console.log(item.place)
    return (
    <TouchableOpacity onPress={() => this.onItemPress(id)}>
      <View style={styles.card}>

      {image && <Image style={{flex: 1, height: 190, borderBottomWidth: 1, borderColor: '#000'}} source={{uri: image}}/>}
      {/* {imgUrl && categories[0] && 
        <View style={styles.category}>
          <Text style={{color: '#fff'}}>{categories[0].name}</Text>
        </View>} */}
      <View style={styles.cardText} >
        <Text style={{fontWeight: 'bold', fontSize: 18, paddingBottom: 4}}>{title}</Text>
        <Text style={{fontSize: 14}}>{this.formatText(description)}</Text>
        <Image source={require('../../assets/images/CalendarIcon.svg')}/>
        <Text>{this.formatDate(dateStart)} - </Text>
        <Text>{this.formatDate(dateEnd)}</Text>
        {/* <Text>{organizer}</Text> */}
        <Text>{url}</Text>
        

      </View>
    </View>
  </TouchableOpacity>
  )
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    marginRight: 0,
    marginLeft: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
  },
  cardText: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
    fontSize: 18,
    // marginTop: -14,
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
  }
})

const mapDispatchToProps = (dispatch) => ({
  changeLoc: (path) => dispatch(changeLocation(path)),
  setPost: (article) => dispatch(setData(article)),
})
const mapStateToProps = createStructuredSelector({
  // path: (state) => get(state, 'url.path'),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(CardEvent)
