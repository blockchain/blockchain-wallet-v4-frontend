import 'babel-polyfill'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme'

Enzyme.configure({ adapter: new Adapter() })

// mock support for fetch and sockets
global.fetch = require('jest-fetch-mock')
global.WebSocket = require('mock-socket').WebSocket

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {}
    }
  }
