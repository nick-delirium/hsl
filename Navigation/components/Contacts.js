import React from 'react'
import {
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  Text,
} from 'react-native'
import { contacts } from '@/constants/contacts'
import { fonts } from '@/constants/Styles'

const onLinkPress = ({ path, isEmail }) => {
  Linking.openURL(`${isEmail ? 'mailto:' : 'https://'}${path}`)
}

const Contacts = () => (
  <View style={styles.background}>
    <Text style={styles.heading}>Редакция</Text>
    {contacts.map(item => (
      <TouchableOpacity
        key={item.path}
        style={styles.contacts}
        onPress={() => onLinkPress(item)}
      >
        <Text
          style={styles.anchor}
        >
          {item.path}
        </Text>
        <Text
          style={styles.text}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#eeeeee',
    paddingTop: 15,
    paddingLeft: 30,
    paddingBottom: 15,
  },
  heading: {
    fontSize: fonts.heading,
    fontWeight: 'bold',
    color: '#959595',
    paddingBottom: 15,
  },
  contacts: {
    paddingBottom: 15,
  },
  anchor: {
    fontSize: fonts.small,
    color: '#333376'
  },
  text: {
    fontSize: fonts.small,
    color: '#959595',
  }
})

export default React.memo(Contacts)
