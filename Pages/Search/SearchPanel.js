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
import { togglePost } from '@/Navigation/reducer'
import { createStructuredSelector } from 'reselect'
import get from 'lodash/get'

class SearchPanel extends React.Component {
  constructor(props) {
    super(props)

    this.inputRef = React.createRef()
    this.state = {
      inputValue: this.props.searchQuery || '',
    }
  }

  onSearchPress = (e) => { 
    if (!this.props.isSearch) {
      this.props.closePost()
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
        style={{
          flexDirection: 'row', 
          paddingLeft: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 3, 
          flex: isSearch ? 1 : null,
          marginLeft: 'auto'
        }}
      >
        <TextInput 
          style={{
            paddingRight: 8, 
            paddingLeft: 8, 
            paddingTop: 5, 
            paddingBottom: 5, 
            color: '#fff', 
            height: 30, 
            fontSize: 18, 
            flex: !isSearch ? 0 : 1,
            display: !isSearch ? 'none' : null
          }}
          keyboardType='web-search'
          onSubmitEditing={this.onSubmitEditing} 
          ref={this.inputRef}
          value={this.state.inputValue}
          onChangeText={(inputValue) => this.setState({inputValue})}
        /> 
        <View 
          style={{
            paddingRight: 7, 
            paddingLeft: !isSearch ? 20 : 5, 
            paddingTop: 5, 
            paddingBottom: 5, 
            height: 30,
            width: 40,
            marginLeft: 'auto',
          }}
          >
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
  closePost: () => dispatch(togglePost(false, '')),
})
const mapStateFromProps = createStructuredSelector({
  searchQuery: (state) => get(state, 'search.searchQuery'),
})

const withConnect = connect(() => mapStateFromProps, mapDispatchToProps)

export default compose(
  withRouter,
  withConnect,
)(SearchPanel)

