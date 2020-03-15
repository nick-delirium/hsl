/* eslint-disable no-extra-boolean-cast */
import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

const SingleComment = ({
  author,
  comment,
  date,
  commentId,
  isWithActions,
}) => (
  <View style={{ flexDirection: 'column', paddingBottom: 10 }}>
    <View style={{ flexDirection: 'row' }}>
      <View style={styles.photoWrapper}>
        <Image
          style={styles.photo}
          resizeMode="cover"
          source={Boolean(author.photo) ? { uri: author.photo } : require('@/assets/images/no_photo.png')}
        />
      </View>
      <View style={{ flex: 15 }}>
        <Text>
          <Text style={styles.name}>
            {`${author.lastname} ${author.name}  `}
          </Text>
          {comment}
        </Text>
      </View>
      <View style={styles.likeWrapper}>
        <Image
          style={styles.likeIcon}
          resizeMode="cover"
          source={require('@/assets/images/like_icon_border.png')}
        />
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

const styles = StyleSheet.create({
  name: {
    fontWeight: 'bold',
  },
  photoWrapper: {
    flex: 1,
    width: 20,
    height: 20,
    marginRight: 10,
  },
  photo: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  likeIcon: {
    width: 15,
    height: 14,
  },
  likeWrapper: {
    flex: 1,
    height: 21,
    width: 21,
  },
})

export default SingleComment
