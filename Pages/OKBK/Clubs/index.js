import React, { PureComponent } from 'react'
import {
  View,
  Image,
  // TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
} from 'react-native'
import { fonts } from '@/constants/Styles'
import Card from '@/components/Card'
import { NumEnding } from '@/common/format'

const { height } = Dimensions.get('window')
const { width } = Dimensions.get('window')

class Clubs extends PureComponent {

  render() {
    const cardData = [
      { name: 'Деловой клуб Ассоциации корейцев Казахстана', number: 256, pic: '../../../assets/images/OKBK/logo_OKBK.png' },
      { name: 'Kimchi', number: 252, pic: '../../../assets/images/OKBK/logo_OKBK.png' },
    ]
    return (
      <ScrollView contentContainerStyle={styles.pageWrapper}>
        {cardData.map((item) => (
          <Card>
            <View style={styles.cardInner}>
              <View style={styles.header}>
                <Text style={styles.clubName}>{item.name}</Text>
              </View>
              <View style={styles.clubInfo}>
                <View style={styles.logoWrapper}>
                  <Image
                    style={styles.logo}
                    resizeMode="contain"
                    // eslint-disable-next-line import/no-dynamic-require
                    source={`${item.pic}`}
                  />
                </View>
                <View style={styles.textWrapper}>
                  <Text style={styles.text}>{item.number + NumEnding(item.number, [' участник', ' участника', ' участников'])}</Text>
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
})


export default Clubs
