/* eslint-disable  */

import 'react-native'
import React from 'react'
import AppIndex from '../index.js'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import 'jest-enzyme'
import configureStore from '../configureStore'
import thunk from 'redux-thunk'
import Adapter from 'enzyme-adapter-react-16'
import jsdom from 'jsdom'
import 'react-native-mock-render/mock'
const {JSDOM} = jsdom
const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window
global.document = document
global.window = document.defaultView
global.navigator = {
  userAgent: 'node.js',
};
function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}
copyProps(window, global);
import { configure, render, mount, shallow } from "enzyme"
configure({ adapter: new Adapter() })

// react doesn't like some of the props that are set on native components (that eventually are set on DOM nodes, so suppress those warnings
const suppressedErrors = /is using incorrect casing.|(React does not recognize the.*prop on a DOM element|Unknown event handler property|is using uppercase HTML|Received `true` for a non-boolean attribute `accessible`|is unrecognized in this browser)/
const realConsoleError = console.error
console.error = message => {
  if (message.match(suppressedErrors)) {
    return
  }
  realConsoleError(message)
}

const store = configureStore()

describe('App render', () => {
  jest.useFakeTimers()

  it('should render correctly', async () => {
    const tree = mount(<AppIndex store={store} />)
    console.log(tree.debug())
    expect(tree.debug()).toBeTruthy()
  })

})
