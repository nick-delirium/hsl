import React from 'react'
import {
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  Text,
} from 'react-native'
import { contacts } from '../../constants/contacts'

const onLinkPress = ({ path, isEmail }) => {
  Linking.openURL(`${isEmail ? 'mailto://' : 'https://'}${path}`)
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
    marginTop: 'auto',
    backgroundColor: '#eeeeee',
    paddingTop: 15,
    paddingLeft: 30,
    paddingBottom: 15,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#959595',
    marginBottom: 15,
  },
  contacts: {
    marginBottom: 15,
  },
  anchor: {
    fontSize: 14,
    color: '#333376'
  },
  text: {
    fontSize: 14,
    color: '#959595',
  }
})

export default Contacts
