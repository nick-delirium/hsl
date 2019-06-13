import React from 'react'
import Drawer from 'react-native-drawer'
import DrawerPanel from './components/DrawerPanel'
import RouterView from '../router.js'
import { getCategories } from './reducer'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

class RouterWithDrawer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      drawerOpen: false,
      drawerDisabled: false,
    }
  }
  
  closeDrawer = () => {
    this._drawer.close()
  }

  openDrawer = () => {
    this._drawer.open()
  }

  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<DrawerPanel closeDrawer={this.closeDrawer} />}
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.4, shadowRadius: 15}}}
        onOpen={() => {
          this.setState({drawerOpen: true})
        }}
        onClose={() => {
          this.setState({drawerOpen: false})
        }}
        tweenDuration={100}
        panThreshold={0.08}
        disabled={this.state.drawerDisabled}
        openDrawerOffset={(viewport) => 100}
        closedDrawerOffset={() => 0}
        panOpenMask={0.2}
        acceptDoubleTap
        tapToClose
        captureGestures
        negotiatePan
      >
        <RouterView 
          openDrawer={this.openDrawer.bind(this)}
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

export default connect(
  mapStateFromProps,
  mapDispatchToProps, 
)(RouterWithDrawer)
