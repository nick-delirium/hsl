import React from 'react'
import { View } from 'react-native'
import SingleComment from '../SingleComment'

const CommentThread = ({ comments }) => (
  <View>
    {comments.map((comment) => (
      <>
        <SingleComment
          isWithActions
          author={comment.author}
          comment={comment.comment}
          likes={comment.likes}
          date={comment.date}
          commentId={comment.commentId}
        />
        {comment.childs ? comment.childs.map((childComment) => (
          <View>
            <SingleComment
              isWithActions
              author={childComment.author}
              comment={childComment.comment}
              likes={childComment.likes}
              date={childComment.date}
              commentId={childComment.commentId}
            />
          </View>
        )) : null}
      </>
    ))}
  </View>
)

export default CommentThread
