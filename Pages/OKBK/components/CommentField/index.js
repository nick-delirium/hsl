import React from 'react'
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native'
import fonts from '@/constants/Styles'

const CommentField = (props) => (
  <View
    style={styles.container}
  >
    <TextInput
      blurOnSubmit
      enablesReturnKeyAutomatically
      autoCompleteType="off"
      keyboardAppearance="light"
      keyboardType="default"
      placeholder="Комментарий"
      placeholderTextColor="#959595"
      returnKeyType="send"
      ref={props.ref}
      onSubmitEditing={props.onSubmit}
      style={{
        width: '100%',
        zIndex: 13,
        height: 50,
        fontSize: fonts.big,
      }}
    />
    <View style={styles.blankSpace} />
  </View>
)

const styles = StyleSheet.create({
  blankSpace: {
    position: 'absolute',
    bottom: -50,
    height: 60,
    width: '120%',
    backgroundColor: 'white',
    zIndex: 12,
  },
  container: {
    marginTop: 'auto',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    height: 60,
    width: '100%',
    zIndex: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 3,
  },
})

export default CommentField
