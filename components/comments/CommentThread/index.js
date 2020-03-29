import React from 'react'
import {
  View, StyleSheet,
} from 'react-native'
import colors from '@/constants/Colors'
import fonts from '@/constants/Styles'
import SingleComment from '../SingleComment'
import { formatComments } from '../utils'

const CommentThread = ({ comments, isInCard }) => {
  const formattedComments = isInCard ? comments : formatComments(comments)
  return (
    <>
      {formattedComments.map((comment) => (
        <React.Fragment key={comment.commentId}>
          <SingleComment
            isWithActions={!isInCard}
            likes={comment.likes}
            date={comment.date}
            author={comment.author}
            comment={comment.comment}
            commentId={comment.commentId}
          />
          {comment.childs && !isInCard ? comment.childs.map((childComment) => (
            <View style={styles.childComment} key={childComment.commentId}>
              <SingleComment
                isChild
                parentAuthor={comment.author}
                isWithActions={!isInCard}
                author={childComment.author}
                likes={childComment.likes}
                comment={childComment.comment}
                date={childComment.date}
                commentId={childComment.commentId}
              />
            </View>
          )) : null}
        </React.Fragment>
      ))}
    </>
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
