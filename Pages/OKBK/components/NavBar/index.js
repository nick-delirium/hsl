import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'


const isAndroid = () => Platform.OS === 'android'

class NavBar extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text> this is a navbar</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: isAndroid ? 14 : 0,
  }
})

export default NavBar
