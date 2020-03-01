import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

const SingleComment = ({
  author,
  comment,
  likes,
  date,
  commentId,
  isWithActions,
}) => (
  <View>
    <View>
      <View>{author.photo}</View>
      <View>
        <Text>
          {`${author.lastname} ${author.name}`}
        </Text>
        <Text>{comment}</Text>
      </View>
      <View>
        {likes}
      </View>
    </View>
    {isWithActions && (
      <View>
        <Text>{date}</Text>
        <TouchableOpacity onClick={() => console.log(commentId)}> Ответить </TouchableOpacity>
      </View>
    )}
  </View>
)

export default SingleComment
