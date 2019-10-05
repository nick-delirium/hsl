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
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { fonts } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import {
  changeCurrentTab,
  setSelectedUser,
  changeTitle,
} from '../reducer'
import PersonalCard from './components/PersonalCard'

const { width } = Dimensions.get('window')

class People extends PureComponent {
  onItemPress = (item) => {
    const { actions } = this.props
    actions.changeCurrentTab('profile')
    actions.setSelectedUser(item)
  }

  render() {
    const { users, selectedClub } = this.props
    return (
      <ScrollView contentContainerStyle={styles.pageWrapper} bounces={false}>
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
              <Text style={styles.сlubText}>{selectedClub.description}</Text>
            )}
            <TouchableOpacity
              style={styles.topCard}
              onItemPress={() => this.onItemPress(selectedClub.chief)}
            >
              <View style={styles.photoWrapper}>
                <Image
                  style={styles.photo}
                  resizeMode="cover"
                  source={Boolean(selectedClub.chief.photo) ? { uri: selectedClub.chief.photo } : require('../assets/no_photo.png')}
                />
              </View>

              <View style={styles.textWrapper}>
                <Text style={{ ...styles.textName, color: '#fff' }}>{selectedClub.chief.last_name}</Text>
                <Text style={{ ...styles.textName, color: '#fff' }}>{selectedClub.chief.first_name}</Text>
                <Text style={styles.text}>Руководитель клуба</Text>
              </View>
            </TouchableOpacity>

            {Boolean(selectedClub.phone) && (
              <Text style={styles.сlubText}>
                {selectedClub.phone}
              </Text>
            )}
            {Boolean(selectedClub.email) && (
              <Text style={styles.сlubText}>
                {selectedClub.email}
              </Text>
            )}
            {Boolean(selectedClub.site) && (
              <Text style={styles.сlubText}>
                {selectedClub.site}
              </Text>
            )}

          </View>
        )}
        {users.map((item) => (
          <PersonalCard onItemPress={() => this.onItemPress(item)} key={item.id} item={item} />
        ))}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  pageWrapper: {
    flexGrow: 1,
    paddingBottom: 80,
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
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    setSelectedUser: (user) => dispatch(setSelectedUser(user)),
    changeCurrentTab: (tabName) => dispatch(changeCurrentTab(tabName)),
    changeTitle: (title) => dispatch(changeTitle(title)),
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(People)
