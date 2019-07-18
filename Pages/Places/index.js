import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking } from 'react-native'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import MapView from 'react-native-maps'
import { getPlaces } from './reducer'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { loc, categories, rusCats, locations, infoWindowContent} from '@/constants/places'
import { fonts } from '@/constants/Styles'

class Places extends Component {
  state = {
    mapRegion: null,  //{ latitude: 59.9483, 30.2531:}
    hasLocationPermissions: false,
    locationResult: null,
    selectedMarker: null,
    displayingMarkers: loc,
    activeFilters: [],
  };

  componentDidMount() {
    this._getLocationAsync()
    if (!this.props.places || !this.props.places.length){
      console.log('fetching places')
      this.props.getPlaces()
    }
  }

  // _handleMapRegionChange = mapRegion => {
  //   this.setState({ mapRegion })
  // };

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
     });
   } else {
     this.setState({ hasLocationPermissions: true })
   }

   let location = await Location.getCurrentPositionAsync({}).then((e) => console.log(e))
   this.setState({ locationResult: JSON.stringify(location) })
   
   // Center the map on the location we just fetched.
    this.setState({mapRegion: { 
      latitude: 59.9483, //location.coords.latitude, 
      longitude: 30.2531,//location.coords.longitude, 
      latitudeDelta: 0.0922, 
      longitudeDelta: 0.0421 
    }})
  };

  onMarkerPress(location) {
    this.setState({selectedMarker: {
      name: location[0],
      catEng: location[3],
      catRus: location[5],
      address: location[6],
      url: location[7],
      tel: location[8],
      time: location[9]
      }
    })
  }

  onCatPress(cat) {
    let activeFilters = [...this.state.activeFilters]
    const ind = activeFilters.indexOf(cat)
    if (ind > -1) {
      activeFilters.splice(ind, 1)
    } else {
      activeFilters.push(cat)
    }

    let filteredLocations = loc.filter(loc => {
      return activeFilters.find(filtr => loc[3] === filtr)
    })
    this.setState({activeFilters: activeFilters, displayingMarkers: filteredLocations})
  }
  render() {
    //loc : name, lat, long, category ++ name, category, address, url, tel, time
    const width = Dimensions.get('window').width
    const { selectedMarker, displayingMarkers, activeFilters } = this.state
    // const { name, catEng, catRus, address, url, tel, time } = this.state.selectedMarker
    // const isMarkerPresent = Boolean(name)
    // const height = Dimensions.get('window').height;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <ScrollView 
            horizontal={true} 
            contentContainerStyle={{ height: 60, padding: 10, flexDirection: 'row', alignItems: 'center'}}
            showsHorizontalScrollIndicator={false}
          >
            {categories().map((cat, i) => {
              return (
              <TouchableOpacity key={i}
                style={{ flex: 1, borderWidth: 1, padding: 10, borderColor: '#333376', borderRadius: 3, marginRight: 10, 
                backgroundColor: activeFilters.includes(cat) ? '#333376' : 'transparent' }}
                onPress={this.onCatPress.bind(this, cat)}
              >
                <Text style={{ color: activeFilters.includes(cat) ? '#fff' : '#333376', fontSize: fonts.heading }}>
                  {rusCats[cat]}
                </Text>
              </TouchableOpacity>)
            })
            }
          </ScrollView>
        </View>
        <View>
        { this.state.locationResult === null ?
          <Text>Finding your current location...</Text> :
          this.state.hasLocationPermissions === false ?
            <Text>Location permissions are not granted.</Text> :
            this.state.mapRegion === null ?
            <Text>Map region doesn't exist.</Text> :
            <MapView
              style={{ width, height: width }}
              region={this.state.mapRegion}
              onRegionChange={this._handleMapRegionChange}
            >
              {displayingMarkers && displayingMarkers.map((location, i) => (
                <MapView.Marker
                  key={i}
                  coordinate={{latitude: location[1],
                  longitude: location[2]}}
                  title={location[0]}
                  description={location[6]}
                  onPress={ () => this.onMarkerPress(location)}
                />
              ))
              }
            </MapView>
        }
        </View>
        <View>
        {selectedMarker &&
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
            <Text style={{color: '#333376', fontSize: fonts.big, fontWeight: "bold", paddingBottom: 10}}>{selectedMarker.name}</Text>
            {selectedMarker.address && 
              <Text>Адрес: {this.state.selectedMarker.address}</Text> }
            {selectedMarker.url && <Text style={{color: '#333376'}} onPress={() => Linking.openURL(selectedMarker.address)}>
              перейти на сайт</Text>}
            {selectedMarker.tel && <Text onPress={() => Linking.openURL('tel:' + selectedMarker.tel)}>{selectedMarker.tel}</Text>}
          </View>
        }
          </View>
        {/* <Text>
          Location: {this.state.locationResult}
        </Text> */}
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
  getPlaces: () => dispatch(getPlaces())
})

const mapStateToProps = createStructuredSelector({
  places: (state) => get(state, 'places'),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(Places)
