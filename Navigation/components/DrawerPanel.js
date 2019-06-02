import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Link } from 'react-router-native'

class DrawerPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { closeDrawer } = this.props
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.controlText}>
          Control Panel
        </Text>

        <Link to="/">
          <Text style={styles.button}>News</Text>
        </Link>
        <Link to="/testpage">
          <Text style={styles.button}>TestPage</Text>
        </Link>

        <TouchableOpacity
          style={styles.button} 
          onPress={closeDrawer}
        >
          <Text>Close Drawer</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  controlText: {
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  }
})

export default DrawerPanel