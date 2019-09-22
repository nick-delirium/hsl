import React, { PureComponent } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native'
import { fonts } from '@/constants/Styles'
import colors from '../colors'
import Card from '@/components/Card'

const { width } = Dimensions.get('window')

const cardData = [
  { name: 'Ким Дмитрий Валентинович', work: 'ГК "Лидер Консалт"', photo: require('../../../assets/images/OKBK/logo_OKBK.png') },
  { name: 'Ким Елена Юрьевна', work: 'ООО "РОСТТОФУ"', photo: require('../../../assets/images/OKBK/logo_OKBK.png') },
]

class People extends PureComponent {
  render() {
    return (
      <ScrollView contentContainerStyle={styles.pageWrapper}>
        <View style={{ height: '50%', width, backgroundColor: '#5F4C96', flexDirection: 'column', alignItems: 'center' }}>
          <View style={styles.topCard}>
            <View style={styles.photoWrapper}>
              <Image
                style={styles.photo}
                resizeMode="cover"
                source={cardData[0].photo}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={{ ...styles.textName, color: '#FFFFFF' }}>{cardData[0].name}</Text>
              <Text style={{ ...styles.text, color: '#FFFFFF' }}>{cardData[0].work}</Text>
            </View>
          </View>
        </View>
        {cardData.map((item) => (
          <Card key={item.name.trim()}>
            <View style={styles.cardInner}>
              <View style={styles.photoWrapper}>
                <Image
                  style={styles.photo}
                  resizeMode="cover"
                  source={item.photo}
                />
              </View>

              <View style={styles.textWrapper}>
                <Text style={styles.textName}>{item.name}</Text>
                <Text style={styles.text}>{item.work}</Text>
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
  topCard: {
    marginRight: 15,
    marginLeft: 15,
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
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 1,
  },
  textWrapper: {
    flex: 3,
    marginLeft: 20,
  },
  textName: {
    fontSize: fonts.heading,
  },
  text: {
    fontSize: fonts.small,
    color: colors.grayText,
  },
})

export default People
