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
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import MapView from 'react-native-maps'
import { withRouter } from 'react-router-native'
import ClusteredMapView from 'react-native-maps-super-cluster'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { categories, rusCats } from '@/constants/places'
import { fonts } from '@/constants/Styles'
import { formatText } from '@/common/format'
import { getPlaces } from './reducer'


class Places extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      hasLocationPermissions: false,
      locationResult: null,
      selectedMarker: null,
      displayingMarkers: this.props.places,
      locationState: 0,
      activeFilters: [],
      city: null,
      initialMapRegion: {
        latitude: 59.9483,
        longitude: 30.2531,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      }
    }
  }

  componentDidMount() {
    this._getLocationAsync()
    if (!this.props.places || !this.props.places.length){
      this.props.getPlaces(this.state.city)
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
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
      this.mapRef.getMapRef().animateToRegion(region, 200)
      // locationState === 2, permission
    }


  };

  onMarkerPress(location) {
    this.setState({ selectedMarker: location })
  }

  onCatPress(cat) {
    const { places } = this.props
    // const { city } = this.state
    let activeFilters = [...this.state.activeFilters]
    const index = activeFilters.indexOf(cat)
    if (index > -1) {
      activeFilters.splice(index, 1)
    } else {
      activeFilters.push(cat)
    }

    let filteredLocations = places.filter(place => {
      // if (place.city === city)
        return activeFilters.find(filtr => place.type === filtr)
    })
    this.setState({activeFilters: activeFilters, displayingMarkers: filteredLocations})
  }

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
          coordinate = cluster.coordinate

    return (
      <MapView.Marker pinColor='#000' coordinate={coordinate} onPress={onPress}>
        <View style={styles.marker}>
          <Text style={{color: '#000', textAlign: 'center', paddingTop: 5}}>
            {pointCount}
          </Text>
        </View>
      </MapView.Marker>
    )
  }

  onCardSitePress = () => {
    const url = !selectedMarker.website.startsWith('http')
      ? 'https://' + selectedMarker.website : selectedMarker.website
    return Linking.openURL(url)
  }

  share = async (place) => {
    const description = place.description ? `${formatText(place.description, true)}. ` : ''
    const address = place.address ? `${place.address}. ` : ''
    const link = `https://www.google.com/maps/search/?api=1&query=${place.geo_lat},${place.geo_lng}`
    try {
      await Share.share({
        message: `${place.venue}. ${description}${address}\n${link}`,
      });
    } catch (error) {
      alert(error.message);
    }
  }

  renderMapState = (displayingMarkers) => {
    const { locationState } = this.state
    const width = Dimensions.get('window').width

    switch(locationState) {
      case 0: // Ищем ваше местоположение...
      case 1: // Нет разрешения на получение вашего местоположения
      case 2:
        return (
          <ClusteredMapView
            style={styles.map}
            ref={(r) => this.mapRef = r}
            width={width}
            height={width}
            style={{ width, height: width, zIndex: 1000 }}
            data={displayingMarkers ? displayingMarkers : [{ geo_lat: 0, geo_lng: 0}]}
            renderCluster={this.renderCluster}
            renderMarker={(location) => (
              <MapView.Marker
                key={location.id}
                pinColor={rusCats[location.type] ? rusCats[location.type].color : '#000'}
                coordinate={{
                  latitude: location.location.latitude,
                  longitude: location.location.longitude,
                }}
                title={location.venue}
                description={location.address}
                onPress={ () => this.onMarkerPress(location)}
              />
            )}
            initialRegion={{
              latitude: this.state.initialMapRegion.latitude,
              longitude: this.state.initialMapRegion.longitude,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
            }}
          />
        )
      default:
        return (
          <Text>Ищем ваше местоположение...</Text>
        )
    }
  }

  render() {
    const { selectedMarker, activeFilters } = this.state
    const displayingMarkers = this.state.displayingMarkers.length ? this.state.displayingMarkers : this.props.places
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}
            showsHorizontalScrollIndicator={false}
          >
            {categories().map((cat, i) => (
              <TouchableOpacity
                key={`${cat}${i}`}
                style={{
                  ...styles.category,
                  backgroundColor: activeFilters.includes(cat) ? rusCats[cat].color : 'transparent',
                  borderColor: rusCats[cat].color,
                }}
                onPress={this.onCatPress.bind(this, cat)}
              >
                <Text style={{ color: activeFilters.includes(cat) ? '#fff' : rusCats[cat].color, fontSize: fonts.heading }}>
                  {rusCats[cat].title}
                </Text>
              </TouchableOpacity>)
            )}
          </ScrollView>
        </View>
        <View>
          {displayingMarkers ? this.renderMapState(displayingMarkers) : (
            <Text>Получаем координаты </Text>
          )}
        </View>

        <View style={styles.markerCard}>
          {selectedMarker ? (
            <View>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text
                  style={{ flex: 0.9, color: '#333376', fontSize: fonts.big, fontWeight: "bold", paddingBottom: 10}}>
                  {selectedMarker.venue}
                </Text>
                <View style={{ marginLeft: 'auto' }}>
                  <TouchableOpacity
                    onPress={() => {this.share(selectedMarker)}}
                    style={{ flex: 0.1, paddingLeft: 5, paddingTop: 9, paddingBottom: 9 }}
                  >
                    <Image
                      source={require('../../assets/images/share-dark.png')}
                      style={{ height: 20, width: 20}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {selectedMarker.description && (
                <Text>{formatText(selectedMarker.description, true)}</Text>
              )}
              {selectedMarker.address && (
                <Text>Адрес: {selectedMarker.address}</Text>
              )}
              {selectedMarker.phone && (
                <Text
                  style={{color: '#00aadb', textDecorationLine: 'underline'}}
                  onPress={() => Linking.openURL('tel:' + selectedMarker.phone)}>
                  {selectedMarker.phone}
                </Text>
              )}
              {selectedMarker.website && (
                <Text
                  style={{color: '#00aadb', textDecorationLine: 'underline', paddingTop: 5}}
                  onPress={this.onCardSitePress}
                >
                  Перейти на сайт
                </Text>
              )}
            </View>
          ) : (
              <Text style={{textAlign: 'center'}}>
                Пожалуйста, выберите точку на карте
              </Text>
          )}
        </View>

      </ScrollView>
    );
  }
}

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
    position: 'absolute',
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
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 40,
    margin: 15,
  },
});

const mapDispatchToProps = (dispatch) => ({
  getPlaces: (city) => dispatch(getPlaces(city))
})

const mapStateToProps = createStructuredSelector({
  places: (state) => get(state, 'locations.places'),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(Places)
