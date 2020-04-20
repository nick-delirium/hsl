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
import HTML from 'react-native-render-html'
import { changeLocation, togglePost } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import fonts from '@/constants/Styles'
import Card from '@/components/Card'
import { events } from '@/analytics'
import { setData } from './articleReducer'

class CardArticle extends React.PureComponent {
  onItemPress = async () => {
    const {
      setPost,
      title,
      data,
      link,
      categories,
      mediaUrl,
      id,
      openPost,
    } = this.props

    events.openPost({ id, source: 'feed' })

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
            categories={type === 'all' && categories[0] ? categories[0] : undefined}
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
            <View style={{ paddingBottom: 4 }}>
              <HTML
                baseFontStyle={{ fontWeight: 'bold', fontSize: fonts.big }}
                html={title}
              />
            </View>
            <HTML
              baseFontStyle={{ fontSize: fonts.normal, lineHeight: 18 }}
              html={`${renderDescr}...`}
            />
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
