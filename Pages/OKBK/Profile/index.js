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
      self = false,
      personalInfo = {},
      account: { user },
      actions,
    } = this.props
    const displayedUser = self ? user : personalInfo
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
              {displayedUser.last_name}
              {'\r\n'}
              {displayedUser.first_name}
            </Text>
            <Text style={styles.smallText}>
              {displayedUser.city_name}
            </Text>
            <Text style={styles.smallText}>
              {displayedUser.business_club_name}
            </Text>
            {displayedUser.career && (
              <Text style={styles.smallText}>
                {displayedUser.career}
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
            {displayedUser.contact_email && (
              <Text style={styles.smallText}>
                {displayedUser.contact_email}
              </Text>
            )}
            {displayedUser.phone && (
              <Text style={styles.smallText}>
                {displayedUser.phone}
              </Text>
            )}
            <View style={styles.contacts}>
              {displayedUser.phone && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    return openLink(`https://api.whatsapp.com/send?phone=${displayedUser.phone.replace('+', '').replace(/ /g,'')}`)
                  }}
                >
                  <View style={styles.contactsRow}>
                    <Image style={{ width: 20, height: 20, marginRight: 10 }} resizeMode="contain" source={require('../assets/WU.png')} />
                    <Text style={{ ...styles.smallText, marginBottom: 0, color: '#33CC33' }}>whatsapp</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {displayedUser.social_media && (
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
    marginBottom: 80,
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
    justifyContent: 'space-between',
    width: '70%',
  },
  contactsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 21,
  },
  profilePhoto: {
    height: 180,
    width: 180,
    borderRadius: 90,
    marginTop: 10,
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
  profileWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
  },
})

const mapStateToProps = createStructuredSelector({
  account: (state) => get(state, 'okbk.account'),
})
const mapDispatchToProps = (dispatch) => ({
  actions: {
    singOut: () => dispatch(singOut()),
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
