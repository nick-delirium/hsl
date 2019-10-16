import React, { useState, useCallback, useEffect } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import {
  changeCurrentTab,
  setSelectedUser,
  changeTitle,
  setFoundData,
} from '../reducer'
import {
  client,
  getClubsQuery,
  getUsersQuery,
  getAreasQuery,
  getCitiesListQuery,
} from '../gqlQueries'
import DefaultSearchTerms from './components/DefaultSearchTerms'
import SearchForm from './components/SearchForm'
import PersonalCard from '../People/components/PersonalCard'
import Profile from '../Profile'
import Colors from '@/constants/Colors'

const { width } = Dimensions.get('window')
const PANEL_TABS = {
  areas: {
    name: 'СФЕРЫ ДЕЯТЕЛЬНОСТИ',
    query: getAreasQuery,
    flex: 2,
  },
  cities: {
    name: 'ГОРОДА',
    query: getCitiesListQuery,
    flex: 1,
  },
  okbk: {
    name: 'ОКБК',
    query: getClubsQuery,
    flex: 1,
  },
}

const getProperEntryData = (tabName, rawData) => {
  switch (tabName) {
    case 'okbk':
      return rawData.businessClubList.businessClubs
    case 'cities':
      return rawData.citiesList.citiesList
    case 'areas':
      return rawData.businessAreaList.businessAreas
    default:
      return []
  }
}

const Search = ({ actions, foundData, personalInfo }) => {
  const { promiseInProgress } = usePromiseTracker()
  const [searchFieldValue, setFieldValue] = useState('')
  const [activeTab, setActiveTab] = useState('areas')
  const [shownEntries, setEntries] = useState([])

  const onTabPress = useCallback((tab) => {
    setActiveTab(tab)
  }, [activeTab])

  useEffect(() => {
    const getEntries = () => {
      const { query } = PANEL_TABS[activeTab]
      trackPromise(
        client.query({ query })
          .then((response) => {
            const askedData = getProperEntryData(activeTab, response.data)
            if (askedData.length > 0) setEntries(askedData)
          }),
      )
    }
    getEntries()
  }, [activeTab])

  const getUsers = useCallback((id, fromItem = false) => {
    if (searchFieldValue === '' && !fromItem) return
    Keyboard.dismiss()
    const searchByItem = {
      business_club_id: activeTab === 'okbk' ? id : undefined,
      business_area_id: activeTab === 'areas' ? id : undefined,
      city_id: activeTab === 'cities' ? id : undefined,
    }
    const searchByQuery = {
      search: searchFieldValue,
    }

    trackPromise(
      client.query({
        query: getUsersQuery,
        variables: fromItem ? searchByItem : searchByQuery,
      })
        .then((response) => {
          const resultData = {
            asked: true,
            data: response.data.users.users.length > 0 ? response.data.users.users : [],
          }
          actions.setFoundData(resultData)
        }),
    )
  }, [searchFieldValue, activeTab])

  const onUserCardPress = (item) => {
    actions.changeTitle(`${item.last_name} ${item.first_name}`, true)
    actions.setSelectedUser(item)
  }

  return (
    <View style={{ flex: 1 }}>
      {Object.entries(personalInfo).length > 0 && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 30,
            backgroundColor: 'white',
          }}
        >
          <Profile />
        </View>
      )}
      <SearchForm
        setFieldValue={setFieldValue}
        searchFieldValue={searchFieldValue}
        placeholder="ОКБК"
        getUsers={getUsers}
      />
      <View style={{ flex: 1, position: 'relative', backgroundColor: Colors.backgroundGray }}>
        {promiseInProgress ? (
          <View style={styles.indicatorWrapper}>
            <ActivityIndicator />
          </View>
        ) : null}
        {!foundData.asked ? (
          <DefaultSearchTerms
            tabs={PANEL_TABS}
            shownEntries={shownEntries}
            getUsers={getUsers}
            onTabPress={onTabPress}
            activeTab={activeTab}
            changeTitle={actions.changeTitle}
          />
        ) : (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingTop: 20, paddingBottom: 20 }}
            keyboardDismissMode="on-drag"
          >
            {foundData.data.map((item) => (
              <PersonalCard
                key={item.id}
                item={item}
                onItemPress={() => onUserCardPress(item)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  indicatorWrapper: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    width,
    height: '100%',
    backgroundColor: 'rgba(255,255,255, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const mapStateToProps = createStructuredSelector({
  personalInfo: (state) => get(state, 'okbk.personalInfo'),
  foundData: (state) => get(state, 'okbk.searchData'),
})
const mapDispatchToProps = (dispatch) => ({
  actions: {
    setFoundData: (data) => dispatch(setFoundData(data)),
    setSelectedUser: (user) => dispatch(setSelectedUser(user)),
    changeCurrentTab: (tabName) => dispatch(changeCurrentTab(tabName)),
    changeTitle: (title, fakeHeader) => dispatch(changeTitle(title, fakeHeader)),
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search)
