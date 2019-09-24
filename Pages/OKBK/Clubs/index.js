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
import Card from '@/components/Card'
import { NumEnding } from '@/common/format'
import { getClubs } from '../reducer'

const { height } = Dimensions.get('window')

// const cardData = [
//   { name: 'Деловой клуб Ассоциации корейцев Казахстана', number: 256, icon: require('../../../assets/images/OKBK/logo_OKBK.png') },
//   { name: 'Kimchi', number: 252, icon: require('../../../assets/images/OKBK/logo_OKBK.png') },
// ]

class Clubs extends PureComponent {
  componentDidMount() {
    const { actions } = this.props
    actions.getClubs()
  }

  onItemPress = (item) => {
    console.log(item)
  }

  render() {
    const { clubs } = this.props
    const photos = [
      require('../../../assets/images/OKBK/logo_OKBK.png'),
      require('../../../assets/images/youtube-play-btn.png'),
      require('../../../assets/images/robot-dev.png'),
    ]
    return (
      <ScrollView contentContainerStyle={styles.pageWrapper}>
        {clubs.map((item) => (
          <Card key={item.name.trim()} onItemPress={() => this.onItemPress(item)}>
            <View style={styles.cardInner}>
              <View style={styles.header}>
                <Text style={styles.clubName}>{item.name}</Text>
              </View>
              <View style={styles.clubInfo}>
                <View style={styles.logoWrapper}>
                  <Image
                    style={styles.logo}
                    resizeMode="contain"
                    // source={item.icon}
                    source={require('../../../assets/images/OKBK/logo_OKBK.png')}
                  />
                </View>
                {/* {item.number && (
                  <View style={styles.textWrapper}>
                    <Text style={styles.text}>{item.number + NumEnding(item.number, [' участник', ' участника', ' участников'])}</Text>
                  </View>
                )} */}
                <View style={styles.textWrapper}>
                  <View style={styles.photoWrapper}>
                    {/* item.photos */}
                    {photos.map((photo, i) => {
                      const l = photos.length
                      return (
                        <Image
                          style={{
                            ...styles.photo,
                            marginRight: (i === l - 1 ? 0 : -10),
                            zIndex: l - i,
                          }}
                          resizeMode="cover"
                          source={photo}
                        />
                      )
                    })}
                  </View>
                  <Text style={styles.text}>{256 + NumEnding(256, [' участник', ' участника', ' участников'])}</Text>
                </View>
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
  },
  cardInner: {
    padding: 20,
    height: 200,
    flexDirection: 'column',
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
  clubs: (state) => get(state, 'okbk.clubs'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    getClubs: () => dispatch(getClubs()),
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Clubs)
