/* eslint-disable no-extra-boolean-cast */
import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import dateFormat from '../utils/dateFormat'

const SingleComment = ({
  likes,
  author,
  comment,
  date,
  commentId,
  isWithActions,
  isChild,
  parentAuthor,
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
          {isChild && (
            <Text style={{ color: '#959595' }}>
              {`${parentAuthor.lastname} ${parentAuthor.name}`}
              {'\n'}
            </Text>
          )}
          {comment}
        </Text>
        {isWithActions && (
          <View style={styles.actions}>
            <Text style={{ color: '#525252' }}>{dateFormat(date)}</Text>
            <TouchableOpacity
              onClick={() => console.log(commentId)}
              style={{ marginLeft: 30, color: '#525252' }}
            >
              <Text>
                Ответить
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.likeWrapper}>
        <Image
          style={styles.likeIcon}
          resizeMode="cover"
          source={require('@/assets/images/like_icon_border.png')}
        />
        {likes > 0 && (
          <Text style={styles.likesCount}>{likes}</Text>
        )}
      </View>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  likesCount: {
    color: '#B62655',
    marginLeft: 5,
  },
  actions: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default SingleComment
