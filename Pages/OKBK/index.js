import React, { PureComponent } from 'react'
import {
  View,
  Text,
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import Colors from '@/constants/Colors'
import Login from './Login'
import Clubs from './Clubs'
import Search from './Search'
import Profile from './Profile'
import Feed from './Feed'
import { authErrors } from './queriesErrors'
import Navbar from './components/NavBar'
import CommentField from './components/CommentField'
import { accountConfirmed, addComment } from './reducer'

class OKBK extends PureComponent {
  constructor(props) {
    super(props)

    this.commentInputRef = React.createRef()
  }

  componentDidMount() {
    const { account } = this.props
    const isAccountEmpty = Object.entries(account).length === 0
    if (isAccountEmpty) this.checkAuth()
  }

  componentDidUpdate(props) {
    if (props.currentComment && this.commentInputRef.current) {
      this.commentInputRef.current.focus()
    }
  }

  checkAuth = () => {
    const { actions } = this.props
    AsyncStorage.getItem('account', (e, acc) => {
      if (acc !== null) {
        actions.accountConfirmed(JSON.parse(acc))
      }
    })
  }

  returnTabView = () => {
    const { currentTab } = this.props
    switch (currentTab) {
      case 'groups':
        return <Clubs />
      case 'profile':
        return <Profile self />
      case 'okbkSearch':
        return <Search />
      case 'favorites':
        return (
          <View style={{ backgroundColor: '#e1e1e1', flex: 1 }}>
            <Text
              style={{
                fontSize: 26, textAlign: 'center', color: '#959595', marginTop: 60,
              }}
            >
              Здесь пусто
            </Text>
          </View>
        )

      default:
        return <Feed />
    }
  }

  onCommentSubmit = (e, parentId) => {
    const { actions, account, currentPost } = this.props
    if (e.nativeEvent.text) {
      actions.addComment(currentPost, e.nativeEvent.text, get(account, 'user.id'), parentId)
    }
  }

  render() {
    const {
      isLoggedIn,
      isLoading,
      error,
      isPostOpen,
      currentComment,
    } = this.props

    if (isLoading) return <Text>loading</Text>

    if (!isLoggedIn) {
      return (
        <Login error={get(authErrors, error)} />
      )
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', zIndex: 10 }}>
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          style={styles.main}
          keyboardVerticalOffset={90}
        >
          <View style={{ flex: 1, paddingBottom: 60 }}>
            {this.returnTabView()}
          </View>
          {/* TODO: set param is it replay */}
          {isPostOpen
            ? <CommentField onSubmit={(e) => this.onCommentSubmit(e, currentComment)} ref={this.commentInputRef} />
            : <Navbar /> }
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
})

const mapStateToProps = createStructuredSelector({
  isLoggedIn: (state) => get(state, 'okbk.isLoggedIn'),
  isLoading: (state) => get(state, 'okbk.isLoading'),
  account: (state) => get(state, 'okbk.account'),
  error: (state) => get(state, 'okbk.error'),
  currentTab: (state) => get(state, 'okbk.currentTab'),
  isPostOpen: (state) => get(state, 'url.isPostOpen'),
  currentPost: (state) => get(state, 'article.id'),
  currentComment: (state) => get(state, 'okbk.currentComment'),
})
const mapDispatchToProps = (dispatch) => ({
  actions: {
    accountConfirmed: (account) => dispatch(accountConfirmed(account)),
    addComment: (postId, comment, userId, parentId) => dispatch(addComment(postId, comment, userId, parentId)),
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(OKBK)
