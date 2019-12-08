import React, { memo, useCallback } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'
import Icon from '@/assets/images/search-icon.png'
import fonts from '@/constants/Styles'
import colors from '@/constants/Colors'

const SearchForm = ({
  setFieldValue,
  searchFieldValue,
  placeholder,
  getUsers,
}) => {
  const onTextChange = useCallback((value) => setFieldValue(value), [searchFieldValue])
  return (
    <View style={styles.formWrapper}>
      <View style={styles.inputWrapper}>
        <TextInput
          enablesReturnKeyAutomatically
          blurOnSubmit
          autoCompleteType="email"
          keyboardAppearance="light"
          keyboardType="web-search"
          clearButtonMode="always"
          onChangeText={onTextChange}
          placeholder={`Поиск по ${placeholder}`}
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          returnKeyType="search"
          style={styles.input}
          value={searchFieldValue}
          onSubmitEditing={getUsers}
        />
        <TouchableOpacity
          style={styles.searchIcon}
          onPress={getUsers}
        >
          <Image
            source={Icon}
            style={{ width: 17, height: 17, alignSelf: 'center' }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  formWrapper: {
    flex: 1,
    backgroundColor: '#333376',
    marginLeft: 5,
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255, 0.2)',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    paddingRight: 0,
    color: colors.text,
    fontSize: fonts.normal,
  },
  searchIcon: {
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 'auto',
  },
})

export default memo(SearchForm)
