import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { changeLocation } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import { setData } from './articleReducer'

class CardArticle extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  onItemPress = (id) => {
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
    const { title, descr, categories, id, mediaUrl, type } = this.props
      return (
        <View>
          <TouchableOpacity onPress={() => this.onItemPress(id)}>
            <View style={styles.card}>
            {mediaUrl && (
              <CachedImage
                source={mediaUrl}
                title={id}
                categories={!type && categories[0] ? categories[0] : undefined}
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
    marginBottom: 15,
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
