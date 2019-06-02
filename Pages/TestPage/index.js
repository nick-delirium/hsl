import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
// import { Route } from 'react-router-native'

const TestPage = (props) => (
  <View>
    <Text style={styles.header}>TestPage</Text>
  </View>
)

const styles = StyleSheet.create({
  header: {
    fontSize: 20
  },
})

export default TestPage