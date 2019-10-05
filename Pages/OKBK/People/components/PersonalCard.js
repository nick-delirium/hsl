/* eslint-disable no-extra-boolean-cast */
import React, { memo } from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native'
import Card from '@/components/Card'
import { fonts } from '@/constants/Styles'
import colors from '../../colors'

const PersonalCard = ({ item, onItemPress }) => (
  <Card onItemPress={onItemPress}>
    <View style={styles.cardInner}>
      <View style={styles.photoWrapper}>
        <Image
          style={styles.photo}
          resizeMode="cover"
          source={Boolean(item.photo) ? { uri: item.photo } : require('../../assets/no_photo.png')}
        />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.textName}>{item.last_name}</Text>
        <Text style={styles.textName}>{item.first_name}</Text>
        {Boolean(item.career) && (
          <Text style={{ ...styles.text, color: colors.grayText }}>
            {item.career}
          </Text>
        )}
      </View>

    </View>
  </Card>
)


const styles = StyleSheet.create({
  cardInner: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 24,
    height: 145,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  photoWrapper: {
    flex: 1,
    marginRight: 20,
    width: '100%',
    height: '100%',
  },
  photo: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 1,
  },
  textWrapper: {
    flex: 3,
    marginLeft: 20,
  },
  textName: {
    fontSize: fonts.normal,
  },
  text: {
    fontSize: fonts.small,
    color: '#ffffff',
    paddingTop: 10,
  },
})

export default memo(PersonalCard)
