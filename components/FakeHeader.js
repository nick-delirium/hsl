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
import SearchForm from '../Pages/OKBK/Search/components/SearchForm'
import useMemberSearch from '../Pages/OKBK/Search/hooks/useMemberSearch'
import useActiveTab from '../Pages/OKBK/Search/hooks/useActiveTab'

const Header = ({
  title,
  actions,
  currentTab,
  fakeHistory,
  openDrawer,
  searchQueryAsked,
}) => {
  const { activeTab: activeSearchTab } = useActiveTab()
  const shouldRenderBackButton = currentTab !== 'okbkSearch' || searchQueryAsked
  const { searchFieldValue, setFieldValue, getUsers } = useMemberSearch('', activeSearchTab, actions.setFoundData)

  const goBackAction = () => {
    if (fakeHistory.length === 1) {
      actions.setFoundData(defaultSearchResult)
      setFieldValue('')
    }
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
            onPress={openDrawer}
            style={styles.clickableZone}
          >
            <Image
              source={require('../assets/images/menu_icon.png')}
              style={{ width: 38, height: 38 }}
            />
          </TouchableOpacity>
        )}
        {currentTab === 'okbkSearch' ? (
          <SearchForm
            setFieldValue={setFieldValue}
            searchFieldValue={searchFieldValue}
            placeholder="ОКБК"
            getUsers={getUsers}
          />
        ) : (
          <Text
            style={styles.navTitle}
          >
            {title && title.slice(0, 23)}
            {title && title.length > 23 && '...'}
          </Text>
        )}
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
  currentTab: (state) => get(state, 'okbk.currentTab'),
  fakeHistory: (state) => get(state, 'okbk.fakeHistory'),
  searchQueryAsked: (state) => get(state, 'okbk.searchData.asked'),
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
