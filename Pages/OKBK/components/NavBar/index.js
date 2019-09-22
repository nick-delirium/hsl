import React, { Component } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import {
  View,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from 'react-native'
import { changeCurrentTab } from '../../reducer'

const TABS = [
  {
    name: 'feed',
    image: require('../../../../assets/images/OKBK/NavBar/news_icon_gray.png'),
    activeImage: require('../../../../assets/images/OKBK/NavBar/news_icon_color.png'),
  },
  {
    name: 'groups',
    image: require('../../../../assets/images/OKBK/NavBar/okbk_icon_gray.png'),
    activeImage: require('../../../../assets/images/OKBK/NavBar/okbk_icon_color.png'),
  },
  {
    name: 'search',
    image: require('../../../../assets/images/OKBK/NavBar/search_icon_gray.png'),
    activeImage: require('../../../../assets/images/OKBK/NavBar/search_icon_color.png'),
  },
  {
    name: 'profile',
    image: require('../../../../assets/images/OKBK/NavBar/persona_icon_gray.png'),
    activeImage: require('../../../../assets/images/OKBK/NavBar/persona_icon_color.png'),
  },
  {
    name: 'favorites',
    image: require('../../../../assets/images/OKBK/NavBar/like_icon_gray.png'),
    activeImage: require('../../../../assets/images/OKBK/NavBar/like_icon_color.png'),
  },
]

// const isAndroid = () => Platform.OS === 'android'

class NavBar extends Component {
  shouldComponentUpdate(nextProps) {
    const { currentTab } = this.props
    if (nextProps.currentTab === currentTab) return false
    return true
  }

  render() {
    const { actions, currentTab } = this.props
    return (
      <View style={styles.container}>
        {TABS.map((tab) => (
          <TouchableWithoutFeedback
            key={tab.name}
            onPressIn={() => actions.changeCurrentTab(tab.name)}
          >
            <View
              style={{
                flex: 1,
                height: '100%',
                padding: 10,
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <Image
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
                source={currentTab === tab.name ? tab.activeImage : tab.image}
              />
            </View>
          </TouchableWithoutFeedback>
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
    padding: 10,
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 2,

    elevation: 3,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
})

const mapStateToProps = createStructuredSelector({
  currentTab: (state) => get(state, 'okbk.currentTab'),
})
const mapDispatchToProps = (dispatch) => ({
  actions: {
    changeCurrentTab: (name) => dispatch(changeCurrentTab(name)),
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
