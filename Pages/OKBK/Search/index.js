import React, { useState, useCallback, useEffect } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Keyboard,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
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

const { width } = Dimensions.get('window')
const PANEL_TABS = {
  areas: {
    name: 'СФЕРЫ ДЕЯТЕЛЬНОСТИ',
    where: 'сферам деятельности',
    query: getAreasQuery,
    flex: 2,
  },
  cities: {
    name: 'ГОРОДА',
    where: 'городам',
    query: getCitiesListQuery,
    flex: 1,
  },
  okbk: {
    name: 'ОКБК',
    where: 'ОКБК',
    query: getClubsQuery,
    flex: 1,
  },
}

const defaultSearchResult = {
  asked: false,
  data: [],
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

const Search = () => {
  const { promiseInProgress } = usePromiseTracker()
  const [searchFieldValue, setFieldValue] = useState('')
  const [placeholder, setPlaceholder] = useState(PANEL_TABS.okbk.where)
  const [activeTab, setActiveTab] = useState('okbk')
  const [shownEntries, setEntries] = useState([])
  const [foundData, setFoundData] = useState(defaultSearchResult)

  const onTabPress = useCallback((tab) => {
    setActiveTab(tab)
    setPlaceholder(PANEL_TABS[tab].where)
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
          setFoundData(resultData)
        }),
    )
  }, [searchFieldValue, activeTab])

  return (
    <View style={{ flex: 1 }}>
      <SearchForm
        setFieldValue={setFieldValue}
        searchFieldValue={searchFieldValue}
        placeholder={placeholder}
        getUsers={getUsers}
      />
      <View style={{ flex: 1, position: 'relative' }}>
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
          />
        ) : (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingTop: 20, paddingBottom: 20 }}
            keyboardDismissMode="on-drag"
          >
            <TouchableOpacity
              style={{
                paddingLeft: 20,
                paddingTop: 10,
                paddingBottom: 5,
                paddingRight: 10,
              }}
              onPress={() => setFoundData(defaultSearchResult)}
            >
              <Text style={{ color: '#333376', fontSize: 17 }}>
                Вернуться назад
              </Text>
            </TouchableOpacity>
            {foundData.data.map((item) => (
              <PersonalCard key={item.id} item={item} />
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

export default Search
