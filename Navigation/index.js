import React from 'react'
import { BackHandler } from 'react-native'
import Drawer from 'react-native-drawer'
import DrawerPanel from './components/DrawerPanel'
import RouterView from '../router.js'
import { getCategories } from './reducer'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-native'

class RouterWithDrawer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      drawerOpen: false,
      drawerDisabled: false,
    }
  }
  
  componentDidMount() { 
    const { history, location } = this.props
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  handleBackPress = () => {
    const { history, location } = this.props
    if (location.pathname === '/') return false
    history.goBack()
    return true
  }

  closeDrawer = () => {
    this._drawer.close()
  }

  openDrawer = () => {
    this._drawer.open()
  }

  render() {
    const { history, location } = this.props
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<DrawerPanel closeDrawer={this.closeDrawer} />}
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.4, shadowRadius: 15}}}
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
          goBack={history.goBack}
        />
      </Drawer>
    )
  }
}

const mapStateFromProps = createStructuredSelector({
  categories: (state) => get(state, 'url.categories'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchCategories: () => dispatch(getCategories()),
})

const RouterWithRouter = withRouter(RouterWithDrawer)

export default connect(
  mapStateFromProps,
  mapDispatchToProps, 
)(RouterWithRouter)
