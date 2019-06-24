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

      {imgUrl && <Image style={{flex: 1, height: 190, borderBottomWidth: 1, borderColor: '#000'}} source={{uri: imgUrl}}/>}
      {imgUrl && categories[0] && 
        <View style={styles.category}>
          <Text style={{color: '#fff'}}>{categories[0].name}</Text>
        </View>}
      <View style={styles.cardText} >
        <Text style={{fontWeight: 'bold', fontSize: 18, paddingBottom: 4}}>{title}</Text>
        <Text style={{fontSize: 14}}>{descr.split('\n<')[0]}...</Text>
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
  path: (state) => get(state, 'url.path'),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(CardArticle)
