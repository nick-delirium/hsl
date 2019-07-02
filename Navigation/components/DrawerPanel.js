import React from 'react'
import {
  StyleSheet,
  Image,
  View,
} from 'react-native'
import { LinearGradient } from 'expo'
import pages from '../../constants/pages'
import DrawerItem from './DrawerItem'

class DrawerPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const items = Object.keys(pages)
    const validMenuItems = items.filter(item => Boolean(pages[item].name))
    return (
        <View style={{
          flexDirection: 'column',
          flex: 1,
          paddingTop: 80,
          backgroundColor: "#fff",
          width: 240,
        }}>
          <Image 
            source={require('../../assets/images/HSL-logo.png')}
            style={styles.image}
          />
          {validMenuItems.map((item) => (
            <DrawerItem
              closeDrawer={this.props.closeDrawer}
              href={pages[item].path}
              text={pages[item].name}
              key={pages[item].name}
            />
          ))}
        </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    width: 180,
    height: 62,
    marginBottom: 35,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingLeft: 40,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  activeButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  }
})

export default DrawerPanel