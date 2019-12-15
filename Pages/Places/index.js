import React, { PureComponent } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Image,
  Share,
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import MapView from 'react-native-map-clustering'
import { Marker } from 'react-native-maps'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { categories, rusCats } from '@/constants/places'
import fonts from '@/constants/Styles'
import { formatText } from '@/common/format'
import { getPlaces } from './reducer'

class Places extends PureComponent {
  constructor(props) {
    super(props)
    const { places } = props
    this.state = {
      // hasLocationPermissions: false,
      // locationResult: null,
      selectedMarker: null,
      displayingMarkers: places,
      locationState: 0,
      activeFilters: [],
      city: null,
      initialMapRegion: {
        latitude: 59.9483,
        longitude: 30.2531,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      },
    }
  }

  componentDidMount() {
    const { places, GetPlaces } = this.props
    const { city } = this.state
    this._getLocationAsync()
    if (!places || !places.length) {
      GetPlaces(city)
    }
  }

  onMarkerPress(location) {
    this.setState({ selectedMarker: location })
  }

  onCatPress(cat) {
    const { places } = this.props
    const { activeFilters } = this.state
    const activeFiltersArr = [...activeFilters]
    const index = activeFiltersArr.indexOf(cat)
    if (index > -1) {
      activeFiltersArr.splice(index, 1)
    } else {
      activeFiltersArr.push(cat)
    }

    const filteredLocations = places.filter((place) => (
      // if (place.city === city)
      activeFiltersArr.find((filtr) => place.type === filtr)
    ))
    this.setState({ activeFilters: activeFiltersArr, displayingMarkers: filteredLocations })
  }

  _getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      // locationState === 1, no permission
    } else {
      const location = await Location.getCurrentPositionAsync()
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      }
      this.mapRef.animateToRegion(region, 200)
      // locationState === 2, permission
    }
  };

  onCardSitePress = async () => {
    const { selectedMarker } = this.state
    const url = !selectedMarker.website.startsWith('http')
      ? `https://${selectedMarker.website}` : selectedMarker.website
    await WebBrowser.openBrowserAsync(url)
  }

  share = async (place) => {
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

  renderMapState = (displayingMarkers) => {
    const { locationState, initialMapRegion } = this.state

    switch (locationState) {
      case 0: // Ищем ваше местоположение...
      case 1: // Нет разрешения на получение вашего местоположения
      case 2:
        return (
          <MapView
            style={styles.map}
            mapRef={(r) => this.mapRef = r}
            width={width}
            height={width}

            initialRegion={{
              latitude: initialMapRegion.latitude,
              longitude: initialMapRegion.longitude,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
            }}
          >
            {displayingMarkers.map((location) => (
              <Marker
                key={location.id}
                pinColor={rusCats[location.type] ? rusCats[location.type].color : '#000'}
                coordinate={{
                  latitude: location.location.latitude,
                  longitude: location.location.longitude,
                }}
                title={location.venue}
                description={location.address}
                onPress={() => this.onMarkerPress(location)}
              />
            ))}
          </MapView>
        )
      default:
        return (
          <Text>Ищем ваше местоположение...</Text>
        )
    }
  }

  render() {
    const { selectedMarker, activeFilters, displayingMarkers } = this.state
    const { places } = this.props
    const displayingMarkersArr = displayingMarkers.length ? displayingMarkers : places
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <ScrollView
            horizontal
            contentContainerStyle={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}
            showsHorizontalScrollIndicator={false}
          >
            {categories().map((cat) => (
              <TouchableOpacity
                key={`${rusCats[cat].title}`}
                style={{
                  ...styles.category,
                  backgroundColor: activeFilters.includes(cat) ? rusCats[cat].color : 'transparent',
                  borderColor: rusCats[cat].color,
                }}
                onPress={() => this.onCatPress(cat)}
              >
                <Text style={{ color: activeFilters.includes(cat) ? '#fff' : rusCats[cat].color, fontSize: fonts.heading }}>
                  {rusCats[cat].title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View>
          {displayingMarkersArr ? this.renderMapState(displayingMarkersArr) : (
            <Text>Получаем координаты </Text>
          )}
        </View>

        <View style={styles.markerCard}>
          {selectedMarker ? (
            <View>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <Text
                  style={{
                    flex: 0.9,
                    color: '#333376',
                    fontSize: fonts.big,
                    fontWeight: 'bold',
                    paddingBottom: 10,
                  }}
                >
                  {selectedMarker.venue}
                </Text>
                <View style={{ marginLeft: 'auto' }}>
                  <TouchableOpacity
                    onPress={() => { this.share(selectedMarker) }}
                    style={{
                      flex: 0.1,
                      paddingLeft: 5,
                      paddingTop: 9,
                      paddingBottom: 9,
                    }}
                  >
                    <Image
                      source={require('../../assets/images/share-dark.png')}
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
                  onPress={this.onCardSitePress}
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
      </ScrollView>
    )
  }
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: '#ecf0f1',
  },
  text: {
    color: '#000',
  },
  map: {
    width,
    height: width,
    zIndex: 1000,
  },
  category: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
    marginRight: 10,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: '#E1E1E1',
    borderColor: '#333376',
    borderWidth: 1,
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

const mapDispatchToProps = (dispatch) => ({
  GetPlaces: (city) => dispatch(getPlaces(city)),
})

const mapStateToProps = createStructuredSelector({
  places: (state) => get(state, 'locations.places'),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(Places)
