import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native'
import { LinearGradient } from 'expo'
import { withRouter } from 'react-router-native'
import DrawerItem from './DrawerItem'

class DrawerPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const items = [{
      text: 'News',
      href: '/',
    }, {
      text: 'Test',
      href: '/testpage'
    }]
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
              <DrawerItem
                closeDrawer={this.props.closeDrawer}
                href={item.href}
                text={item.text}
                key={item.text}
              />
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