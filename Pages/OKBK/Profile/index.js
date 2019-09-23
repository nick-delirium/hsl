import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import get from 'lodash/get'
import {
  StyleSheet,
  View,
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

const mapSocialNetwork = (link) => {
  if (link.includes('facebook')) return 'facebook'
  if (link.includes('twitter')) return 'twitter'
  if (link.includes('instagram')) return 'instagram'
  if (link.includes('vk')) return 'vk'
  return link
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
    const { self = false, account: { user }, actions } = this.props
    console.log(user)
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
        {self && <ProfileActions singOutAction={actions.singOut} />}
        <View style={styles.profileWrapper}>

          <View>
            <Image
              source={user.photo ? { uri: user.photo } : require('../assets/no_photo.png')}
              resizeMode="contain"
              style={styles.profilePhoto}
            />
          </View>
          <Text style={styles.nameText}>
            {user.name}
          </Text>
          <Text style={styles.smallText}>
            {user.city_name}
          </Text>
          <Text style={styles.smallText}>
            {user.business_club_name}
          </Text>
          {user.career && (
            <Text style={styles.smallText}>
              {user.career}
            </Text>
          )}

          {user.business_areas.length > 0 && (
            <>
              <Text style={styles.heading}> Сфера деятельности </Text>
              {user.business_areas.map((area) => (
                <Text key={area.id} style={styles.smallText}>{area.name}</Text>
              ))}
            </>
          )}

          <Text style={styles.heading}> Контакты </Text>
          {user.contact_email && (
            <Text style={styles.smallText}>
              {user.contact_email}
            </Text>
          )}
          {user.phone && (
            <Text style={styles.smallText}>
              {user.phone}
            </Text>
          )}
          {user.social_media && (
            <TouchableWithoutFeedback
              onPress={() => openLink(`https://${user.social_media}`)}
            >
              <Text style={{ ...styles.smallText, color: '#333376' }}>
                {mapSocialNetwork(user.social_media)}
              </Text>
            </TouchableWithoutFeedback>
          )}
          <View style={styles.contacts}>
            {user.whatsapp && (
              <TouchableWithoutFeedback onPress={() => openLink(`https://wa.me/${user.phone.replace('+', '')}`)}>
                <View style={styles.contactsRow}>
                  <Image style={{ width: 20, height: 20, marginRight: 10 }} resizeMode="contain" source={require('../assets/WU.png')} />
                  <Text style={{ ...styles.smallText, marginBottom: 0, color: '#33CC33' }}>whatsapp</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
            {user.telegram && (
              <View style={styles.contactsRow}>
                <Image style={{ width: 22, height: 20, marginRight: 10 }} resizeMode="contain" source={require('../assets/T.png')} />
                <Text style={{ ...styles.smallText, marginBottom: 0, color: '#3FA9F5' }}>telegram</Text>
              </View>
            )}
          </View>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
    width: '40%',
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
  },
  nameText: {
    fontSize: fonts.big,
    fontWeight: 'bold',
    marginBottom: 11,
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
