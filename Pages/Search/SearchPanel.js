import React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import Icon from '@/assets/images/search-icon.png'
import { searchPosts } from './reducer'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'

class SearchPanel extends React.Component {
  constructor(props) {
    super(props)

    this.inputRef = React.createRef()
    this.state = {
      inputValue: '',
    }
  }

  onSearchPress = (e) => { 
    if (!this.props.isSearch) {
      this.props.history.push('/search')
      this.inputRef && this.inputRef.current && this.inputRef.current.focus()
    } else {
      this.searchFn(this.state.inputValue)
    }
  }

  onSubmitEditing = (e) => {
    if (e.nativeEvent.text){
      this.searchFn(e.nativeEvent.text)
    }
  }

  searchFn = (value) => {
    const { searchPostsAction } = this.props
    searchPostsAction(value)
  }

  render () {
    const { isSearch } = this.props
    return (
      <TouchableOpacity 
        onPress={this.onSearchPress}
        style={{flexDirection: 'row', paddingLeft: 5, }}
      >
        <TextInput style={{backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 3, paddingRight: 8, paddingLeft: 8, paddingTop: 5, paddingBottom: 5, color: '#fff', height: 30, fontSize: 18, 
          flex: !isSearch ? 0 : 1,
          width: !isSearch ? 0 : null
        }}
          keyboardType='web-search'
          onSubmitEditing={this.onSubmitEditing} ref={this.inputRef}
          value={this.state.inputValue}
          onChangeText={(inputValue) => this.setState({inputValue})}
        /> 
        <View style={{backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3, paddingRight: 7, paddingLeft: 8, paddingTop: 5, paddingBottom: 5, height: 30 }}>
          <Image 
            source={Icon}
            style={{ width: 17, height: 17, alignSelf: 'flex-end'}}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  searchPostsAction: (query, limit = 20) => dispatch(searchPosts(query, limit)),
})
const withConnect = connect(() => ({}), mapDispatchToProps)

export default compose(
  withRouter,
  withConnect,
)(SearchPanel)

