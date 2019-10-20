import React from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'

class Card extends React.PureComponent {
  onPress = () => {
    const { onItemPress } = this.props
    if (onItemPress) {
      return onItemPress()
    }
    return null
  }

  render() {
    const { onItemPress, children } = this.props
    return (
      <TouchableOpacity
        delayPressIn={150}
        activeOpacity={onItemPress ? 0.6 : 1}
        onPress={this.onPress}
      >
        <View style={styles.card}>
          {children}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
})

export default Card
