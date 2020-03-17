import React from 'react'
import {
  View, StyleSheet,
} from 'react-native'
import colors from '@/constants/Colors'
import fonts from '@/constants/Styles'
import SingleComment from '../SingleComment'
import { formatComments } from '../utils'

const CommentThread = ({ comments }) => {
  const formattedComments = formatComments(comments)
  return (
    <View>
      {formattedComments.map((comment) => (
        <>
          <SingleComment
            // isWithActions
            key={comment.commentId}
            author={comment.author}
            comment={comment.comment}
          />
          {comment.childs ? comment.childs.map((childComment) => (
            <View style={styles.childComment}>
              <SingleComment
                // isWithActions
                key={comment.commentId}
                author={childComment.author}
                comment={childComment.comment}
                // likes={childComment.likes}
                // date={childComment.date}
                commentId={childComment.commentId}
              />
            </View>
          )) : null}
        </>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    width: '100%',
    padding: 15,
    textAlign: 'center',
    color: colors.text,
    fontSize: fonts.normal,
  },
  childComment: {
    paddingLeft: 20,
  },
})

export default CommentThread
