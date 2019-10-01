import React, { PureComponent } from 'react'
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
import { fonts } from '@/constants/Styles'
import colors from '../colors'
import Colors from '@/constants/Colors'
import Card from '@/components/Card'

const { width } = Dimensions.get('window')

class People extends PureComponent {
  render() {
    const { users, selectedClub } = this.props
    // selectedClub.name  / short_name- set to title
    return (
      <ScrollView contentContainerStyle={styles.pageWrapper}>
        { selectedClub && (
          <View style={styles.topWrapper}>

            <Image
              style={styles.logo}
              resizeMode="contain"
              // source={selectedClub.icon ? { uri: selectedClub.icon } : require('../assets/no_photo.png')}
              source={require('../../../assets/images/OKBK/logo_OKBK.png')}
            />
            <Text style={styles.сlubText}>{selectedClub.description}</Text>

            <View style={styles.topCard}>
              <View style={styles.photoWrapper}>
                <Image
                  style={styles.photo}
                  resizeMode="cover"
                  source={selectedClub.chief.photo ? { uri: selectedClub.chief.photo } : require('../assets/no_photo.png')}
                />
              </View>
              <View style={styles.textWrapper}>
                <Text style={{ ...styles.textName, color: '#fff' }}>{selectedClub.chief.last_name}</Text>
                <Text style={{ ...styles.textName, color: '#fff' }}>{selectedClub.chief.first_name}</Text>
                {/* <Text style={styles.text}>{selectedClub.chief.career}</Text> */}
                <Text style={styles.text}>Руководитель клуба</Text>
              </View>
            </View>

            {selectedClub.phone && <Text style={styles.сlubText}>{selectedClub.phone}</Text>}
            {selectedClub.email && <Text style={styles.сlubText}>{selectedClub.email}</Text>}
            {selectedClub.site && <Text style={styles.сlubText}>{selectedClub.site}</Text>}

          </View>
        )}
        {users.map((item) => (
          <Card key={item.name && item.name.trim()}>
            <View style={styles.cardInner}>
              <View style={styles.photoWrapper}>
                <Image
                  style={styles.photo}
                  resizeMode="cover"
                  source={item.photo ? { uri: item.photo } : require('../assets/no_photo.png')}
                />
              </View>

              <View style={styles.textWrapper}>
                <Text style={styles.textName}>{item.last_name}</Text>
                <Text style={styles.textName}>{item.first_name}</Text>
                <Text
                  style={{ ...styles.text, color: colors.grayText }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {item.career /* it will be shorter */}
                </Text>
              </View>

            </View>
          </Card>
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
    // position: 'absolute',
    // bottom: 0,
    // left: -10,
    // height: '100%',
    width: '70%',
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
  cardInner: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 24,
    height: 145,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
    borderWidth: 1,
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
  // actions: {
  //   getClubs: () => dispatch(getClubs()),
  // },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(People)
