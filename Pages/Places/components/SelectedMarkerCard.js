import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native'
import * as Linking from 'expo-linking'
import { formatText } from '@/common/format'
import fonts from '@/constants/Styles'

const share = async (place) => {
  const description = place.description ? `${formatText(place.description, true)}. ` : ''
  const address = place.address ? `${place.address}. ` : ''
  const link = `https://www.google.com/maps/search/?api=1&query=${place.geo_lat},${place.geo_lng}`
  try {
    await Share.share({
      message: `${place.venue}. ${description}${address}\n${link}`,
    })
  } catch (error) {
    alert(error.message)
  }
}

const SelectedMarkerCard = ({ selectedMarker, onCardSitePress }) => (
  <View style={styles.markerCard}>
    {selectedMarker ? (
      <View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text
            style={styles.title}
          >
            {selectedMarker.venue}
          </Text>
          <View style={{ marginLeft: 'auto' }}>
            <TouchableOpacity
              onPress={() => share(selectedMarker)}
              style={styles.shareIcon}
            >
              <Image
                source={require('../../../assets/images/share-dark.png')}
                style={{ height: 20, width: 20 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {selectedMarker.description && (
          <Text>{formatText(selectedMarker.description, true)}</Text>
        )}
        {selectedMarker.address && (
          <Text>
            Адрес:
            &nbsp;
            {selectedMarker.address}
          </Text>
        )}
        {selectedMarker.phone && (
          <Text
            style={{ color: '#00aadb', textDecorationLine: 'underline' }}
            onPress={() => Linking.openURL(`tel: ${selectedMarker.phone}`)}
          >
            {selectedMarker.phone}
          </Text>
        )}
        {selectedMarker.website && (
          <Text
            style={{ color: '#00aadb', textDecorationLine: 'underline', paddingTop: 5 }}
            onPress={onCardSitePress}
          >
            Перейти на сайт
          </Text>
        )}
      </View>
    ) : (
      <Text style={{ textAlign: 'center' }}>
        Пожалуйста, выберите точку на карте
      </Text>
    )}
  </View>
)


const styles = StyleSheet.create({
  title: {
    flex: 10,
    color: '#333376',
    fontSize: fonts.big,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  shareIcon: {
    flex: 1,
    paddingLeft: 5,
    paddingTop: 9,
    paddingBottom: 9,
  },
  markerCard: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
    margin: 15,
  },
})

export default SelectedMarkerCard
