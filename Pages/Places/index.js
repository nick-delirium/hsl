import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking } from 'react-native'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import MapView from 'react-native-maps'
import { getPlaces } from './reducer'
import { withRouter } from 'react-router-native'
import ClusteredMapView from 'react-native-maps-super-cluster'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { categories, rusCats } from '@/constants/places'
import { fonts } from '@/constants/Styles'
import { formatText } from '@/common/format'


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
      city: 'Санкт-Петербург',
      initialMapRegion: {
        latitude: 59.9483,  
        longitude: 30.2531,
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
      this.setState({
        locationState: 1,
      });
    } else {
      const location = await Location.getCurrentPositionAsync()
      this.setState({ 
        locationState: 2,
        initialMapRegion: {
          latitude: location.coords.latitude, longitude: location.coords.longitude,
        }, 
      })
    }

   
  };

  onMarkerPress(location) {
    this.setState({ selectedMarker: location })
  }

  onCatPress(cat) {
    const { places } = this.props
    const { city } = this.state
    let activeFilters = [...this.state.activeFilters]
    const index = activeFilters.indexOf(cat)
    if (index > -1) {
      activeFilters.splice(index, 1)
    } else {
      activeFilters.push(cat)
    }

    let filteredLocations = places.filter(place => {
      if (place.city === city)
        return activeFilters.find(filtr => place.type === filtr)
    })
    this.setState({activeFilters: activeFilters, displayingMarkers: filteredLocations})
  }

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
          coordinate = cluster.coordinate
  
    return (
      <MapView.Marker pinColor='#000' coordinate={coordinate} onPress={onPress}>
        <View style={{ width:30, height: 30, borderRadius: 50, backgroundColor: '#eee', borderColor: '#333376', borderWidth: 1}}>
          <Text style={{color: '#000', textAlign: 'center', paddingTop: 5}}>
            {pointCount}
          </Text>
        </View>
      </MapView.Marker>
    )
  }

  renderMapState = (displayingMarkers) => {
    const { locationState } = this.state
    const width = Dimensions.get('window').width

    switch(locationState) {
      case 0:
        return (
          <Text>Ищем ваше местоположение...</Text>
        )
      case 1:
        return (
          <Text>Нет разрешения на получение вашего местоположения.</Text>
        )
      case 2:
        return (
          <ClusteredMapView
            ref={map => this._map = map}
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
              longitudeDelta: 0.3
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
            contentContainerStyle={{  padding: 10, flexDirection: 'row', alignItems: 'center'}}
            showsHorizontalScrollIndicator={false}
          >
            {categories().map((cat, i) => (
              <TouchableOpacity key={i}
                style={{ flex: 1, borderWidth: 1, padding: 10, borderColor: rusCats[cat].color, borderRadius: 3, marginRight: 10, 
                backgroundColor: activeFilters.includes(cat) ? rusCats[cat].color : 'transparent' }}
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
        
        { this.state.locationState === 2 &&
          <View style={{
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 4,
            shadowOffset: {width: 0, height: 4},
            paddingTop: 10,
            paddingLeft: 20,
            paddingBottom: 40,
            margin: 15,
          }}>
          {selectedMarker ? (<View>
            <Text style={{color: '#333376', fontSize: fonts.big, fontWeight: "bold", paddingBottom: 10}}>{selectedMarker.venue}</Text>

            {selectedMarker.description && <Text>{formatText(selectedMarker.description, true)}</Text>}
            {selectedMarker.address && 
              <Text>Адрес: {selectedMarker.address}</Text> }
            {selectedMarker.phone && 
            <Text style={{color: '#00aadb', textDecorationLine: 'underline'}}
              onPress={() => Linking.openURL('tel:' + selectedMarker.phone)}>
              {selectedMarker.phone}
            </Text>}
            {selectedMarker.website && 
            <Text style={{color: '#00aadb', textDecorationLine: 'underline', paddingTop: 5}}
              onPress={() => {
                let url = !selectedMarker.website.startsWith('http') ? 'http://' + selectedMarker.website : selectedMarker.website
                return Linking.openURL(url)}}>
              Перейти на сайт</Text>}
          </View>)
              : <Text style={{textAlign: 'center'}}>Пожалуйста, выберите точку на карте</Text>
              }
          </View>
        }
        
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

  }
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
