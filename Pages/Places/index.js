import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { MapView, Location, Permissions } from 'expo'
import { getPlaces } from './reducer'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { loc, categories, locations, infoWindowContent} from '@/constants/places'

class Places extends Component {
  state = {
    mapRegion: null,  //{ latitude: 59.9483, 30.2531:}
    hasLocationPermissions: false,
    locationResult: null
  };

  componentDidMount() {
    this._getLocationAsync()
    if (!this.props.places || !this.props.places.length){
      console.log('fetching places')
      this.props.getPlaces()
    }
    // console.log(this.props.places)
  }

  _handleMapRegionChange = mapRegion => {
    console.log(mapRegion)
    this.setState({ mapRegion })
  };

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
     });
   } else {
     this.setState({ hasLocationPermissions: true })
   }

   let location = await Location.getCurrentPositionAsync({})
   this.setState({ locationResult: JSON.stringify(location) })
   
   // Center the map on the location we just fetched.
    this.setState({mapRegion: { 
      latitude: 59.9483, //location.coords.latitude, 
      longitude: 30.2531,//location.coords.longitude, 
      latitudeDelta: 0.0922, 
      longitudeDelta: 0.0421 
    }})
  };

  render() {
    // console.log(this.props.places)
    //loc : name, lat, long, category ++ name, category, address, url, tel, time

    return (
      <View style={styles.container}>
        {categories().map(cat => {
          return <Text>
            {cat}
          </Text>
        })

        }
        { 
          this.state.locationResult === null ?
          <Text>Finding your current location...</Text> :
          this.state.hasLocationPermissions === false ?
            <Text>Location permissions are not granted.</Text> :
            this.state.mapRegion === null ?
            <Text>Map region doesn't exist.</Text> :
            <MapView
              style={{ alignSelf: 'stretch', height: 400 }}
              region={this.state.mapRegion}
              onRegionChange={this._handleMapRegionChange}
            >
              {loc.map(location => (
                <MapView.Marker
                  coordinate={{latitude: location[1],
                      longitude: location[2]}}
                  title={location[0]}
                  description={location[6]}
                />
              ))
              }
            </MapView>
        }
        
        <Text>
          Location: {this.state.locationResult}
        </Text>
      </View>
        
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
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
