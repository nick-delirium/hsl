import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  goBack,
  setFoundData,
  defaultSearchResult,
} from '../Pages/OKBK/reducer'

const Header = ({ title, actions, fakeHistory }) => {
  const shouldRenderBackButton = true

  const goBackAction = () => {
    if (fakeHistory.length === 1) actions.setFoundData(defaultSearchResult)
    actions.goBack()
  }

  return (
    <View style={styles.nav}>
      <View
        style={styles.container}
      >
        {shouldRenderBackButton ? (
          <TouchableOpacity
            onPress={goBackAction}
            style={styles.clickableZone}
          >
            <View
              style={styles.backIcon}
            >
              <Image
                source={require('../assets/images/back.png')}
                style={{ width: 19, height: 19 }}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => null}
            style={styles.clickableZone}
          >
            <Image
              source={require('../assets/images/back.png')}
              style={{ width: 38, height: 38 }}
            />
          </TouchableOpacity>
        )}
        <Text
          style={styles.navTitle}
        >
          {title && title.slice(0, 23)}
          {title && title.length > 23 && '...'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 5,
  },
  clickableZone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 9,
    paddingLeft: 6,
    paddingRight: 6,
    marginRight: -3,
    zIndex: 11,
    paddingBottom: 9,
  },
  nav: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingTop: 45,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    backgroundColor: '#333376',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: 'normal',
    color: 'rgba(255, 255, 255, 0.6)',
    paddingLeft: 10,
  },
  navTitle: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
})

const mapStateFromProps = createStructuredSelector({
  title: (state) => get(state, 'okbk.title'),
  fakeHistory: (state) => get(state, 'okbk.fakeHistory'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    goBack: () => dispatch(goBack()),
    setFoundData: (data) => dispatch(setFoundData(data)),
  },
})

export default connect(
  mapStateFromProps,
  mapDispatchToProps,
)(Header)
