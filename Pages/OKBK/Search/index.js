import React, { useState, useCallback, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { fonts } from '@/constants/Styles'
import Icon from '@/assets/images/search-icon.png'
import colors from '../colors'
import {
  client,
  getClubsQuery,
  getUsersQuery,
} from '../gqlQueries'

const { width } = Dimensions.get('window')
const PANEL_TABS = {
  areas: {
    name: 'СФЕРЫ ДЕЯТЕЛЬНОСТИ',
    where: 'сферам деятельности',
    flex: 2,
  },
  cities: {
    name: 'ГОРОДА',
    where: 'городам',
    flex: 1,
  },
  okbk: {
    name: 'ОКБК',
    where: 'ОКБК',
    flex: 1,
  },
}

const Search = () => {
  const [searchFieldValue, setFieldValue] = useState('')
  const [placeholder, setPlaceholder] = useState(PANEL_TABS.okbk.where)
  const [activeTab, setActiveTab] = useState('okbk')
  const [shownEntries, setEntries] = useState([])

  const onTextChange = useCallback((value) => setFieldValue(value), [searchFieldValue])
  const onTabPress = useCallback((tab) => {
    setActiveTab(tab)
    setPlaceholder(PANEL_TABS[tab].where)
  }, [activeTab])

  useEffect(() => {
    const getClubs = async () => {
      const response = await client.query({ query: getClubsQuery })
      const { businessClubList: { businessClubs } } = response.data
      const clubNames = businessClubs.map((club) => club.name)
      if (clubNames.length > 0) setEntries(clubNames)
    }
    getClubs()
  }, [])

  const getUsers = useCallback(async () => {
    const clubId = undefined
    const areaId = undefined
    const cityId = undefined
    Keyboard.dismiss()
    if (searchFieldValue === '') return
    const response = await client.query({
      query: getUsersQuery,
      variables: {
        search: searchFieldValue,
        business_club_id: clubId,
        business_area_id: areaId,
        city_id: cityId,
      },
    })
    return console.log(response.data.users.users.length)
  }, [searchFieldValue])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ width, padding: 10, backgroundColor: '#333376' }}>
        <View style={styles.inputWrapper}>
          <TextInput
            enablesReturnKeyAutomatically
            blurOnSubmit={false}
            autoCompleteType="email"
            keyboardAppearance="light"
            keyboardType="web-search"
            clearButtonMode="always"
            onChangeText={onTextChange}
            placeholder={`Поиск по ${placeholder}`}
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            returnKeyType="search"
            style={styles.input}
            value={searchFieldValue}
            onSubmitEditing={getUsers}
          />
          <TouchableOpacity
            style={{
              paddingRight: 15,
              paddingLeft: 15,
              paddingTop: 5,
              paddingBottom: 5,
              marginLeft: 'auto',
            }}
            onPress={getUsers}
          >
            <Image
              source={Icon}
              style={{ width: 17, height: 17, alignSelf: 'center' }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.panel}>
        {Object.keys(PANEL_TABS).map((tab) => (
          <TouchableOpacity
            onPress={() => onTabPress(tab)}
            style={{
              ...styles.tab,
              flex: PANEL_TABS[tab].flex,
              borderBottomColor: '#333376',
              borderBottomWidth: tab === activeTab ? 3 : 0,
            }}
            key={tab}
          >
            <Text
              style={{
                ...styles.tabText,
                color: tab === activeTab ? '#333376' : '#9C9CC5',
              }}
            >
              {PANEL_TABS[tab].name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        contentContainerStyle={{ flex: 1, padding: 20 }}
        keyboardDismissMode="on-drag"
      >
        {shownEntries.map((entry) => (
          <TouchableOpacity key={entry} style={styles.searchEntry}>
            <Text style={styles.searchEntryText}>{entry}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchEntry: {
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  searchEntryText: {
    color: '#959595',
    fontSize: fonts.normal,
  },
  input: {
    flex: 1,
    padding: 10,
    paddingRight: 0,
    color: colors.text,
    fontSize: fonts.normal,
  },
  panel: {
    height: 45,
    backgroundColor: '#E4E4FF',
    width,
    flexDirection: 'row',
  },
  tab: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: '#9C9CC5',
    fontSize: 14,
    fontWeight: 'bold',
  },
})

export default Search
