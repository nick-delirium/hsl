import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo'
import { withRouter } from 'react-router-native'

class DrawerPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  onItemPress = (path) => {
    this.props.history.push(path)
    this.props.closeDrawer()
  }

  render() {
    return (
      <LinearGradient
        style={{ flex: 1 }}
        colors={['#1323DD', '#DD13DD']}
        start={[0,1]}
        end={[1,0]}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.controlText}>
            Control Panel
          </Text>

          <TouchableOpacity onPress={() => this.onItemPress('/')}>
            <Text style={styles.button}>News</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onItemPress('/testpage')}>
            <Text style={styles.button}>TestPage</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

export default withRouter(DrawerPanel)