import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { View, TouchableOpacity, Text, Image, StyleSheet, Platform } from 'react-native'
import { changeCurrentTab } from '../../reducer'

const TABS = [
  {
    name: 'feed',
    image: require('../../../../assets/images/OKBK/NavBar/feed.png'),
  },
  {
    name: 'groups',
    image: require('../../../../assets/images/OKBK/NavBar/groups.png'),
  },
  {
    name: 'search',
    image: require('../../../../assets/images/OKBK/NavBar/search.png'),
  },
  {
    name: 'profile',
    image: require('../../../../assets/images/OKBK/NavBar/profile.png'),
  },
  {
    name: 'favorites',
    image: require('../../../../assets/images/OKBK/NavBar/favorites.png'),
  },
]

// const isAndroid = () => Platform.OS === 'android'

class NavBar extends PureComponent {
  render() {
    const { actions } = this.props
    return (
      <View style={styles.container}>
        {TABS.map((tab) => (
          <TouchableOpacity onPress={() => actions.changeCurrentTab(tab.name)} key={tab.name} style={{ flex: 1, padding: 10 }}>
            <Image
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
              source={tab.image}
            />
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
})

const mapDispatchToProps = dispatch => ({
  actions: {
    changeCurrentTab: (name) => dispatch(changeCurrentTab(name))
  },
})

export default connect(() => ({}), mapDispatchToProps)(NavBar)
