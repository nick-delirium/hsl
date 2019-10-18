import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { changeLocation, togglePost } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import { setData } from './articleReducer'
import { fonts } from '@/constants/Styles'
import Card from '@/components/Card'

class CardArticle extends React.PureComponent {
  onItemPress = () => {
    const {
      setPost,
      // changeLoc,
      // history,
      // path,
      title,
      data,
      link,
      categories,
      mediaUrl,
      id,
      openPost,
    } = this.props

    // const newPath = 'post/' + id
    const article = {
      title,
      mediaUrl,
      id,
      link,
      categories,
      content: data.content,
    }
    setPost(article)
    // history.push(newPath)
    openPost(true, 'article')
    // changeLoc(newPath)
  }

  render() {
    const {
      title,
      descr,
      categories = [],
      mediaUrl,
      type,
      htmlView,
    } = this.props
    const renderDescr = htmlView ? descr : descr.split('\n<')[0]
    const isPromo = categories.map((c) => c.id).includes(617)
    const categoriesWithoutPromo = categories.filter((c) => c.id !== 617)
    return (
      <Card onItemPress={this.onItemPress}>
        {mediaUrl && (
          <CachedImage
            source={mediaUrl}
            title={mediaUrl.slice(-4)}
            categories={!type && categoriesWithoutPromo[0] ? categoriesWithoutPromo[0] : undefined}
            style={{
              flex: 1,
              height: 190,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          />
        )}
        {!isPromo && (
          <View style={styles.cardText}>
            <Text
              style={{ fontWeight: 'bold', fontSize: fonts.big, paddingBottom: 4 }}
            >
              {title}
            </Text>
            <Text
              style={{ fontSize: fonts.normal, lineHeight: 18 }}
            >
              {renderDescr}
              ...
            </Text>
          </View>
        )}
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
})

const mapDispatchToProps = (dispatch) => ({
  changeLoc: (path) => dispatch(changeLocation(path)),
  setPost: (article) => dispatch(setData(article)),
  openPost: (isOpen, type) => dispatch(togglePost(isOpen, type)),
})
const mapStateToProps = createStructuredSelector({
  path: (state) => get(state, 'url.path'),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(CardArticle)
