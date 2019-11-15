import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
import { Linking } from 'expo'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { changeLocation, togglePost } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import { setData } from './articleReducer'
import fonts from '@/constants/Styles'
import Card from '@/components/Card'

class CardArticle extends React.PureComponent {
  onItemPress = async () => {
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
    try {
      const inAppLink = await Linking.makeUrl('redirect', { type: `articleZ${id}` })
      setPost({ ...article, inAppLink })
      openPost(true, 'article')
    } catch (e) {
      throw new Error(e)
    }
    // history.push(newPath)
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
      date,
    } = this.props
    const renderDescr = htmlView ? descr : descr.split('\n<')[0]
    const isPromo = categories.map((c) => c.id).includes(617)
    return (
      <Card onItemPress={this.onItemPress}>
        {mediaUrl && (
          <CachedImage
            source={mediaUrl}
            title={mediaUrl.slice(-4)}
            categories={!type && categories[0] ? categories[0] : undefined}
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
            {date && (
              <Text style={{ paddingTop: 8 }}>
                {date}
              </Text>
            )}
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
