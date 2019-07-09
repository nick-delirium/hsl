import React from 'react'
import {
  StyleSheet,
  View,
  Linking,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { social } from '../../constants/contacts'

const onLinkPress = ({ url, iosUrl, anrdUrl, isEmail }) => {
  const appUrl = Platform.OS === 'ios' ? iosUrl : anrdUrl
  Linking.canOpenURL(appUrl).then(supported => {
    if (supported) {
      return Linking.openURL(appUrl)
    } else {
      return Linking.openURL(url)
    }
  })
}

const Social = () => (
  <View style={styles.socialBlock}>
    {social.map(item => (
        <TouchableOpacity
          key={item.name}
          onPress={() => onLinkPress(item)}
        >
          <Image
            style={styles.image}
            resizeMode="contain"
            source={item.image}
          />
        </TouchableOpacity>
      )
    )}
  </View>
)

const styles = StyleSheet.create({
  socialBlock: {
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  image: {
    height: 20,
    maxWidth: 25,
  }
})

export default Social
