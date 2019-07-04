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
import CachedImage from '../../../components/CachedImage'

class CardArticle extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  onItemPress = (id) => {
    console.log(this.props)
    const { 
      setPost, 
      changeLoc, 
      history, 
      path,
      title,
      data,
      categories,
      mediaUrl,
    } = this.props
    const newPath = 'post/' + id
    const article = {
      title,
      mediaUrl,
      id,
      categories,
      content: data.content,
    }
    setPost(article)
    history.push(newPath)
    changeLoc(path)
  }

  render () {
    const { title, descr, categories, id, mediaUrl } = this.props
      return (
        <View style={{ paddingLeft: 20, paddingRight: 20 }}>
          <TouchableOpacity onPress={() => this.onItemPress(id)}>
            <View style={styles.card}>
            {mediaUrl && (
              <CachedImage
                source={mediaUrl}
                title={id}
                categories={categories[0] ? categories[0] : undefined}
                style={{flex: 1, height: 190, borderBottomWidth: 1, borderColor: '#000'}}
              />
            )}
            <View style={styles.cardText} >
              <Text style={{fontWeight: 'bold', fontSize: 18, paddingBottom: 4}}>{title}</Text>
              <Text style={{fontSize: 14}}>{descr.split('\n<')[0]}...</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
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
  },
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
