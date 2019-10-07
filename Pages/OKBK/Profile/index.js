/* eslint-disable arrow-body-style */
import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import get from 'lodash/get'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
  Linking,
} from 'react-native'
import { fonts } from '@/constants/Styles'
import { singOut } from '../reducer'

const { width } = Dimensions.get('window')

const openLink = (link) => Linking.openURL(link)

const sendRequest = () => {
  Alert.alert(
    'Изменение профиля',
    'Сейчас вы будете перенаправлены на запрос изменения профиля',
    [
      { text: 'Отменить' },
      { text: 'Перейти', onPress: () => openLink('mailto:info@hansanglab.com') },
    ],
    { cancelable: false },
  )
}

const ProfileActions = ({ singOutAction }) => (
  <View style={styles.actions}>
    <TouchableOpacity
      onPress={sendRequest}
    >
      <Text style={styles.actionButton}>Изменить профиль</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={singOutAction}
    >
      <Text style={styles.actionButton}>Выйти</Text>
    </TouchableOpacity>
  </View>
)

class Profile extends React.PureComponent {
  render() {
    const {
      personalInfo = {},
      account: { user },
      actions,
      clubs,
    } = this.props
    const self = !Object.entries(personalInfo).length > 0
    const displayedUser = self ? user : personalInfo
    const businessClub = displayedUser.business_club_id
      ? clubs.find((club) => (club.id === displayedUser.business_club_id))
      : null
    const bcIcon = get(businessClub, 'icon')
    return (
      <ScrollView>
        <View style={styles.mainView}>
          {self && <ProfileActions singOutAction={actions.singOut} />}
          <View style={styles.profileWrapper}>

            <View>
              <Image
                source={displayedUser.photo ? { uri: displayedUser.photo } : require('../assets/no_photo.png')}
                resizeMode="cover"
                style={styles.profilePhoto}
              />
            </View>
            <Text style={styles.nameText}>
              {displayedUser.first_name}
              {'\r\n'}
              {displayedUser.last_name}
            </Text>
            <Text style={styles.smallText}>
              {displayedUser.city_name}
            </Text>
            {Boolean(displayedUser.career) && (
              <Text style={styles.smallText}>
                {displayedUser.career}
              </Text>
            )}
            {Boolean(displayedUser.bio) && (
              <Text style={styles.smallText}>
                {displayedUser.bio}
              </Text>
            )}

            {displayedUser.business_areas.length > 0 && (
              <>
                <Text style={styles.heading}> Сфера деятельности </Text>
                {displayedUser.business_areas.map((area) => (
                  <Text key={area.id} style={styles.smallText}>{area.name}</Text>
                ))}
              </>
            )}

            <Text style={styles.heading}> Контакты </Text>
            {Boolean(displayedUser.contact_email) && (
              <Text style={styles.smallText} onPress={() => openLink(`mailto:${displayedUser.contact_email}`)}>
                {displayedUser.contact_email}
              </Text>
            )}
            {Boolean(displayedUser.phone) && (
              <Text style={styles.smallText} onPress={() => openLink(`tel:${displayedUser.phone}`)}>
                {displayedUser.phone}
              </Text>
            )}
            <View style={styles.contacts}>
              {Boolean(displayedUser.phone) && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    return openLink(`https://api.whatsapp.com/send?phone=${displayedUser.phone.replace('+', '').replace(/ /g, '')}`)
                  }}
                >
                  <View style={{ ...styles.contactsRow, marginRight: 20 }}>
                    <Image style={{ width: 20, height: 20, marginRight: 10 }} resizeMode="contain" source={require('../assets/WU.png')} />
                    <Text style={{ ...styles.smallText, marginBottom: 0, color: '#33CC33' }}>whatsapp</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {Boolean(displayedUser.social_media) && (
                <TouchableWithoutFeedback
                  onPress={() => openLink(`https://${displayedUser.social_media}`)}
                >
                  <View style={styles.contactsRow}>
                    <Image style={{ width: 20, height: 20, marginRight: 10 }} resizeMode="contain" source={require('../assets/facebook.png')} />
                    <Text style={{ ...styles.smallText, marginBottom: 0, color: '#2F80ED' }}>
                      facebook
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>

            {bcIcon && (
              <Image
                source={{ uri: bcIcon }}
                resizeMode="cover"
                style={styles.logo}
              />
            )}

          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
  },
  actions: {
    width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 15,
  },
  contacts: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '70%',
  },
  contactsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 21,
  },
  profilePhoto: {
    height: 160,
    width: 160,
    borderRadius: 80,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#f6f6f6',
  },
  actionButton: {
    fontSize: fonts.small,
    color: '#333376',
  },
  heading: {
    fontSize: fonts.heading,
    fontWeight: 'bold',
    color: '#9F9F9F',
    marginBottom: 10,
    marginTop: 15,
  },
  smallText: {
    fontSize: fonts.mini,
    marginBottom: 10,
    textAlign: 'center',
  },
  nameText: {
    fontSize: fonts.big,
    fontWeight: 'bold',
    marginBottom: 11,
    textAlign: 'center',
  },
  logo: {
    height: 100,
    width: 200,
    padding: 10,
    marginTop: 20,
  },
  profileWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
  },
})

const mapStateToProps = createStructuredSelector({
  account: (state) => get(state, 'okbk.account'),
  personalInfo: (state) => get(state, 'okbk.personalInfo'),
  clubs: (state) => get(state, 'okbk.clubs'),
})
const mapDispatchToProps = (dispatch) => ({
  actions: {
    singOut: () => dispatch(singOut()),
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
