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
import { changeLocation } from '../../../Navigation/reducer'
import { setData } from '../../../Redux/articleReducer'

class CardArticle extends React.Component {
constructor(props) {
    super(props)
    this.state = {
    imgUrl: null,
    isFetching: false,
    error: null,
    }
  }
  /*
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  btoa = (input = '')  => {
    let str = input;
    let output = '';

    for (let block = 0, charCode, i = 0, map = this.chars;
    str.charAt(i | 0) || (map = '=', i % 1);
    output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

      charCode = str.charCodeAt(i += 3/4);

      if (charCode > 0xFF) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }

      block = block << 8 | charCode;
    }

    return output;
  }

  atob = (input = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);

      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = this.chars.indexOf(buffer);
    }

    return output;
  }
  */


  componentDidMount() {
    if (this.props.mediaUrl) {
    fetch(this.props.mediaUrl
      // , {
      // headers: new Headers({
      //   "Authorization": `Basic ${this.btoa(`login.ru:pass`)}`
      // })}
      )
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
    const { imgUrl } = this.state
    const newPath = 'post/' + id
    const article = {
      title,
      imgUrl,
      content: data.content,
    }
    setPost(article)
    history.push(newPath)
    changeLoc(path)
  }

  render () {
    const { title, descr, categories, id } = this.props
    const { imgUrl } = this.state
    return (
    <TouchableOpacity onPress={() => this.onItemPress(id)}>
      <View style={styles.card}>

      {imgUrl && <Image style={{flex: 1, height: 140}} source={{uri: imgUrl}}/>}
      {imgUrl && categories[0] && 
        <View style={styles.category}>
          <Text style={{color: '#fff'}}>{categories[0].name}</Text>
        </View>}
      <View style={styles.cardText} >
        <Text style={{fontWeight: 'bold'}}>{title}</Text>
        <Text>{descr.split('\n<')[0]}...</Text>
        <Text>{this.props.mediaUrl}</Text>
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
    padding: 10,
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
    top: -130,
  }
})

const mapDispatchToProps = (dispatch) => ({
  changeLoc: (path) => dispatch(changeLocation(path)),
  setPost: (article) => dispatch(setData(article)),
})
const mapStateToProps = createStructuredSelector({
  path: (state) => get(state, 'url.path'),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(CardArticle)
