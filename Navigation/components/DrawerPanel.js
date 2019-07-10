import React from 'react'
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  Dimensions,
} from 'react-native'
import pages from '../../constants/pages'
import DrawerItem from './DrawerItem'
import Contacts from './Contacts'
import Social from './Social'

class DrawerPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const items = Object.keys(pages)
    const validMenuItems = items.filter(item => Boolean(pages[item].name))
    const screenHeight = Dimensions.get('window').height
    return (
        <View style={{
          flexDirection: 'column',
          paddingTop: 10,
          backgroundColor: "#fff",
          flex: 1,
        }}>
          <Image 
            source={require('../../assets/images/HSL-logo.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={{ flex:1 }}>
            <ScrollView contentContainerStyle={{ flex:1, flexDirection: "column", justifyContent: "space-between", height: screenHeight }}>
              <View style={{ flex: 1 }}>
              {validMenuItems.map((item) => (
                <DrawerItem
                  closeDrawer={this.props.closeDrawer}
                  href={pages[item].path}
                  text={pages[item].name}
                  key={pages[item].name}
                />
              ))}
              </View>
                <Social/>
                <Contacts />
            </ScrollView>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    width: 180,
    marginBottom: 0,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingLeft: 30,
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