/* eslint-disable no-extra-boolean-cast */
import React, { PureComponent } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import fonts from '@/constants/Styles'
import Colors from '@/constants/Colors'
import {
  changeCurrentTab,
  changeTitle,
  setSelectedUser,
} from '../reducer'
import PersonalCard from './components/PersonalCard'
import Profile from '../Profile'

const { width } = Dimensions.get('window')

const openLink = async (link, isEmail) => {
  if (isEmail) {
    Linking.openURL(link)
  } else {
    await WebBrowser.openBrowserAsync(link)
  }
}

class People extends PureComponent {
  onItemPress = (item) => {
    const { actions } = this.props
    actions.changeTitle(`${item.last_name} ${item.first_name}`, true)
    actions.setSelectedUser(item)
  }

  render() {
    const { users, selectedClub, personalInfo } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: Colors.backgroundGray }}>
        {Object.entries(personalInfo).length > 0 && (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 30,
              paddingBottom: 80,
            }}
          >
            <Profile />
          </View>
        )}
        <ScrollView contentContainerStyle={styles.pageWrapper}>
          {selectedClub && (
            <View style={styles.topWrapper}>
              {Boolean(selectedClub.icon2 || selectedClub.icon) && (
                <Image
                  style={styles.logo}
                  resizeMode="contain"
                  source={{ uri: selectedClub.icon2 ? selectedClub.icon2 : selectedClub.icon }}
                />
              )}
              {Boolean(selectedClub.description) && (
                <Text style={{ ...styles.сlubText, marginTop: 10 }}>
                  {selectedClub.description}
                </Text>
              )}
              <TouchableOpacity
                style={styles.topCard}
                onPress={() => this.onItemPress(selectedClub.chief)}
              >
                <View style={styles.photoWrapper}>
                  <Image
                    style={styles.photo}
                    resizeMode="cover"
                    source={Boolean(selectedClub.chief.photo) ? { uri: selectedClub.chief.photo } : require('../assets/no_photo.png')}
                  />
                </View>

                <View style={styles.textWrapper}>
                  <Text style={{ ...styles.textName, color: '#fff' }}>{selectedClub.chief.first_name}</Text>
                  <Text style={{ ...styles.textName, color: '#fff' }}>{selectedClub.chief.last_name}</Text>
                  <Text style={styles.text}>
                    {`${Boolean(selectedClub.chief_position) ? selectedClub.chief_position : 'Руководитель клуба'}`}
                  </Text>
                </View>
              </TouchableOpacity>

              {Boolean(selectedClub.phone) && (
                <Text style={styles.сlubText} onPress={() => openLink(`tel:${selectedClub.phone}`)}>
                  {selectedClub.phone}
                </Text>
              )}
              {Boolean(selectedClub.email) && (
                <Text style={styles.сlubText} onPress={() => openLink(`mailto:${selectedClub.email}`, true)}>
                  {selectedClub.email}
                </Text>
              )}
              {Boolean(selectedClub.site) && (
                <Text style={styles.сlubText} onPress={() => openLink(`http://${selectedClub.site}`)}>
                  {selectedClub.site}
                </Text>
              )}

            </View>
          )}
          {users.map((item) => (
            item.id !== selectedClub.chief.id
            && <PersonalCard onItemPress={() => this.onItemPress(item)} key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pageWrapper: {
    flexGrow: 1,
    paddingBottom: 120,
    backgroundColor: Colors.backgroundGray,
  },
  topWrapper: {
    width,
    backgroundColor: '#5F4C96',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 15,
  },
  logo: {
    height: 100,
    width: 200,
    padding: 10,
  },
  topCard: {
    marginRight: 15,
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    padding: 20,
    paddingTop: 24,
    paddingBottom: 24,
    height: 145,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B7BC7',
  },
  photoWrapper: {
    flex: 1,
    marginRight: 20,
    width: '100%',
    height: '100%',
  },
  photo: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  textWrapper: {
    flex: 3,
    marginLeft: 20,
  },
  textName: {
    fontSize: fonts.normal,
  },
  text: {
    fontSize: fonts.small,
    color: '#ffffff',
    paddingTop: 10,
  },
  сlubText: {
    fontSize: fonts.small,
    marginLeft: 15,
    marginRight: 15,
    color: '#ffffff',
  },
})

const mapStateToProps = createStructuredSelector({
  users: (state) => get(state, 'okbk.users'),
  selectedClub: (state) => get(state, 'okbk.selectedClub'),
  personalInfo: (state) => get(state, 'okbk.personalInfo'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    setSelectedUser: (user) => dispatch(setSelectedUser(user)),
    changeCurrentTab: (tabName) => dispatch(changeCurrentTab(tabName)),
    changeTitle: (title, navbar) => dispatch(changeTitle(title, navbar)),
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(People)
