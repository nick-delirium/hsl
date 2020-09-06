import React from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Clipboard,
} from 'react-native'
import Constants from 'expo-constants' // 'expo-constants' with the latest SDK to date
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { contacts } from '@/constants/contacts'
import fonts from '@/constants/Styles'
import { events } from '@/analytics'

const onLinkPress = async ({ path, isEmail }) => {
  events.clickOnSocialLink(path)
  if (isEmail) {
    Linking.openURL(`mailto:${path}`)
  } else {
    await WebBrowser.openBrowserAsync(`https://${path}`)
  }
}

const Contacts = () => (
  <View style={styles.background}>
    <Text style={styles.heading}>Редакция</Text>
    {contacts.map((item) => (
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

export const AdditionalInfo = (props) => {
  const { userId } = props
  return (
    <View style={{ ...styles.background, paddingTop: 0 }}>
      <Text style={styles.heading}>О приложении</Text>
      <Text
        style={styles.text}
      >
        {`версия: ${Constants.manifest.version}`}
      </Text>
      {userId && (
        <>
          <Text
            style={styles.text}
          >
            {`id: ${userId}`}
          </Text>
          <TouchableOpacity
            onPress={() => Clipboard.setString(userId)}
          >
            <Text
              style={styles.anchor}
            >
              скопировать
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

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
    color: '#333376',
  },
  text: {
    fontSize: fonts.small,
    color: '#959595',
  },
})

export default React.memo(Contacts)
