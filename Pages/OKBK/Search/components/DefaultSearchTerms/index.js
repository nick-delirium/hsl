import React, { useCallback } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import fonts from '@/constants/Styles'

const { width } = Dimensions.get('window')

const DefaultSearchTerms = ({
  tabs,
  shownEntries,
  getUsers,
  onTabPress,
  changeTitle,
  activeTab,
}) => {
  const searchUsers = useCallback((id, fromItem, entryName) => {
    changeTitle(entryName, true)
    getUsers(id, fromItem)
  })
  const changeTab = useCallback((tabName) => onTabPress(tabName), [])

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.panel}>
        {Object.keys(tabs).map((tab) => (
          <TouchableOpacity
            onPress={() => changeTab(tab)}
            style={{
              ...styles.tab,
              flex: tabs[tab].flex,
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
              {tabs[tab].name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        keyboardDismissMode="on-drag"
      >
        {shownEntries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={styles.searchEntry}
            onPress={() => searchUsers(entry.id, true, entry.name)}
          >
            <Text style={styles.searchEntryText}>{entry.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
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

export default DefaultSearchTerms
