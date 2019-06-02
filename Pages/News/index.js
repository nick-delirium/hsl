import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'
// import { Route } from 'react-router-native'

const News = (props) => (
  <View>
    <Text style={styles.header}>News</Text>
  </View>
)

const styles = StyleSheet.create({
  header: {
    fontSize: 20
  },
})

export default News