/* eslint-disable no-extra-boolean-cast */
import React, { useCallback, useEffect } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import fonts from '@/constants/Styles'
import Colors from '@/constants/Colors'
import Card from '@/components/Card'
import { NumeralDeclension } from '@/common/format'
import {
  getClubs,
  setSelectedClub,
} from './reducer'
import {
  changeTitle,
} from '../reducer'
import {
  getUsers,
} from '../People/reducer'
import People from '../People'

const { height } = Dimensions.get('window')

const Clubs = ({ actions, clubs, users }) => {
  useEffect(() => {
    actions.getClubs()
  })

  const onItemPress = useCallback((item) => {
    actions.getUsers({ business_club_id: item.id })
    actions.setSelectedClub(item)
    actions.changeTitle(item.short_name || item.name, true)
  })

  if (users.length > 0) return <People />
  return (
    <ScrollView contentContainerStyle={styles.pageWrapper} bounces={false}>
      {clubs.map((item) => (
        <Card
          key={item.id}
          onItemPress={() => onItemPress(item)}
        >
          <View style={styles.cardInner}>
            <View style={styles.header}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.clubName}
              >
                {item.name}
              </Text>
            </View>
            <View style={styles.clubInfo}>
              <View style={styles.logoWrapper}>
                <Image
                  style={styles.logo}
                  resizeMode="contain"
                  source={Boolean(item.icon) ? { uri: item.icon } : undefined}
                />
              </View>
              <View style={styles.textWrapper}>
                <View style={styles.photoWrapper}>
                  {item.randomUsers.map((user, i) => {
                    const l = item.randomUsers.length
                    return (
                      <Image
                        key={`${item.id}_${Math.random()}`}
                        style={{
                          ...styles.photo,
                          marginRight: (i === l - 1 ? 0 : -10),
                          zIndex: l - i,
                        }}
                        resizeMode="cover"
                        // source={require('../../../assets/images/youtube-play-btn.png')}
                        source={Boolean(user.photo) ? { uri: user.photo } : require('../assets/no_photo.png')}
                      />
                    )
                  })}
                </View>
                <Text style={styles.text}>
                  {item.usersCount + NumeralDeclension(item.usersCount, [' участник', ' участника', ' участников'])}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  pageWrapper: {
    flexGrow: 1,
    backgroundColor: Colors.backgroundGray,
    paddingBottom: 80,
  },
  cardInner: {
    padding: 20,
    height: 200,
    flexDirection: 'column',
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  header: {
    flex: 1,
  },
  clubName: {
    fontSize: fonts.big,
    fontWeight: 'bold',
  },
  clubInfo: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  text: {
    fontSize: fonts.small,
  },
  textWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logoWrapper: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    bottom: 0,
    left: -10,
    height: '100%',
    width: '100%',
  },
  photoWrapper: {
    flexDirection: 'row',
  },
  photo: {
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  oneClubWrapper: {
    position: 'absolute',
    top: 0,
    paddingBottom: 92, // height of header
    left: 0,
    zIndex: 9,
    height,
    backgroundColor: '#E1E1E1',
    flex: 1,
  },
})

const mapStateToProps = createStructuredSelector({
  clubs: (state) => get(state, 'okbk.clubs.clubs'),
  users: (state) => get(state, 'okbk.users.users'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    getClubs: () => dispatch(getClubs()),
    getUsers: (params) => dispatch(getUsers(params)),
    setSelectedClub: (club) => dispatch(setSelectedClub(club)),
    changeTitle: (title, fakeNavBar) => dispatch(changeTitle(title, fakeNavBar)),
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Clubs)
