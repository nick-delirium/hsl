import React from 'react'
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  Dimensions,
} from 'react-native'
import pages from '@/constants/pages'
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
          paddingTop: 30,
          backgroundColor: "#fff",
          flex: 1,
          height: screenHeight,
        }}>
          <Image 
            source={require('../../assets/images/HSL-logo.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
            <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                {validMenuItems.map((item) => (
                  <DrawerItem
                    closeDrawer={this.props.closeDrawer}
                    href={pages[item].path}
                    text={pages[item].name}
                    key={pages[item].name}
                  />
                ))}
                <DrawerItem
                  closeDrawer={this.props.closeDrawer}
                  share
                  text="Пригласить друга"
                />
              </View>
              <View style={{ flex: 1, marginBottom: 'auto' }}>
                <Social/>
                <Contacts />
              </View>
            </View>
            </ScrollView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    height: 70,
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