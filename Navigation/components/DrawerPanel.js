import React from 'react'
import {
  ScrollView,
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
    return (
      <LinearGradient
        style={{ flex: 1 }}
        colors={['#1323DD', '#DD13DD']}
        start={[0,1]}
        end={[1,0]}
      >
        <ScrollView contentContainerStyle={{
          flexDirection: 'column',
          paddingTop: 50,
        }}>
          <Image 
            source={require('./logo_HSL.png')}
            style={styles.image}
          />
          <View
            styles={{
              alignItems: 'stretch'
            }}
          >
            {items.map((item) => (
              pages[item].name ? (<DrawerItem
                closeDrawer={this.props.closeDrawer}
                href={pages[item].path}
                text={pages[item].name}
                key={pages[item].name}
              />) : null
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
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
    color: 'white',
  },
  activeButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  }
})

export default DrawerPanel