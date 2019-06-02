import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
import TabBarIcon from './TabBarIcon';
import { Platform } from 'react-native';

// import Colors from '../constants/Colors';

export default class Header extends React.Component {
    onHamburgerClick = () => {
        this.props.toggleDrawer();
    }
  
    render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#ff3340',
        flexDirection: 'row',
      }}>
          <View>
              <TouchableOpacity onPress={this.onHamburgerClick} style={{alignSelf: 'flex-start'}}>
                <TabBarIcon
                    // focused={focused}
                    name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
                    />
              </TouchableOpacity>
              <Text style={{alignSelf: 'center'}}>
                  {this.props.title}
              </Text>
          </View>
      </View>
    );
  }
}