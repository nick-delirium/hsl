import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
import CommentThread from '../CommentThread'

const InArticleComments = ({ comments, isInCard, commentsLength }) => (
  <>
    <Text style={styles.commentsCount}>
      Всего комментариев:
      {' '}
      {commentsLength}
    </Text>
    <View style={styles.topCommentWrapper}>
      <CommentThread
        isInCard={isInCard}
        comments={comments}
      />
    </View>
  </>
)


const styles = StyleSheet.create({
  topCommentWrapper: {
    marginTop: 5,
  },
  commentsCount: {
    color: '#525252',
  },
})

export default InArticleComments
