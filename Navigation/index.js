import React from 'react'
import { BackHandler, Keyboard } from 'react-native'
import Drawer from 'react-native-drawer'
import DrawerPanel from './components/DrawerPanel'
import RouterView from '../router.js'
import { getCategories, togglePost } from './reducer'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-native'

class RouterWithDrawer extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      drawerOpen: false,
      drawerDisabled: false,
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  handleBackPress = () => {
    const { history, location, isPostOpen, actions } = this.props
    if (isPostOpen) {
      actions.togglePost(false)
      return true
    }
    if (location.pathname === '/') return false
    Keyboard.dismiss()
    history.goBack()
    return true
  }

  goBack = () => {
    const { history } = this.props
    console.log(this.props.location)
    Keyboard.dismiss()
    history.goBack()
  }

  closeDrawer = () => {
    this.setState({ drawerOpen: false }, () => this._drawer.close())
  }

  openDrawer = () => {
    this.setState({ drawerOpen: true }, () => this._drawer.open())
  }

  render() {
    const { location } = this.props
    const { drawerOpen } = this.state
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<DrawerPanel closeDrawer={this.closeDrawer} />}
        onOpen={() => {
          setTimeout(() => { this.setState({drawerOpen: true}) }, 0)
        }}
        onClose={() => {
          setTimeout(() => { this.setState({drawerOpen: false}) }, 0)
        }}
        tweenDuration={100}
        panThreshold={0.08}
        disabled={this.state.drawerDisabled}
        openDrawerOffset={(viewport) => 100}
        closedDrawerOffset={0}
        panOpenMask={0.2}
        acceptDoubleTap
        tapToClose
        captureGestures
        negotiatePan
      >
        <RouterView
          openDrawer={this.openDrawer.bind(this)}
          location={location.pathname}
          goBack={this.goBack}
          drawerOpen={drawerOpen}
        />
      </Drawer>
    )
  }
}

const mapStateFromProps = createStructuredSelector({
  categories: (state) => get(state, 'url.categories'),
  isPostOpen: (state) => get(state, 'url.isPostOpen'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    togglePost: (isOpen) => dispatch(togglePost(isOpen)),
  }
})

const RouterWithRouter = withRouter(RouterWithDrawer)

export default connect(
  mapStateFromProps,
  mapDispatchToProps,
)(RouterWithRouter)
