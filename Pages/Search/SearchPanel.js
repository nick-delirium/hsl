import React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import get from 'lodash/get'
import Icon from '@/assets/images/search-icon.png'
import { togglePost } from '@/Navigation/reducer'
import { events } from '@/analytics'
import { searchPosts } from './reducer'

class SearchPanel extends React.Component {
  constructor(props) {
    super(props)
    const { searchQuery } = this.props
    this.inputRef = React.createRef()
    this.state = {
      inputValue: searchQuery || '',
    }
  }

  onSearchPress = () => {
    const { isSearch, closePost, history } = this.props
    const { inputValue } = this.state
    events.clickOnSearch(inputValue)
    if (!isSearch) {
      closePost()
      history.push('/search')
      // eslint-disable-next-line no-unused-expressions
      this.inputRef && this.inputRef.current && this.inputRef.current.focus()
    } else {
      this.searchFn(inputValue)
    }
  }

  onSubmitEditing = (e) => {
    if (e.nativeEvent.text) {
      this.searchFn(e.nativeEvent.text)
    }
  }

  searchFn = (value) => {
    const { searchPostsAction } = this.props
    searchPostsAction(value)
  }

  render() {
    const { isSearch } = this.props
    const { inputValue } = this.state
    return (
      <TouchableOpacity
        onPress={this.onSearchPress}
        style={{
          flexDirection: 'row',
          paddingLeft: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          flex: isSearch ? 1 : null,
          marginLeft: 'auto',
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
            display: !isSearch ? 'none' : null,
          }}
          keyboardType="web-search"
          onSubmitEditing={this.onSubmitEditing}
          ref={this.inputRef}
          value={inputValue}
          onChangeText={(value) => this.setState({ inputValue: value })}
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
            style={{ width: 17, height: 17, alignSelf: 'flex-end' }}
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
