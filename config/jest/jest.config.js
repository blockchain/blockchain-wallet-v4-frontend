import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import '@babel/polyfill'

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
      removeListener: function () {},
    }
  }

window.coins = {
  BTC: {
    coinfig: {
      name: 'Bitcoin',
      precision: 8,
      products: ['PrivateKey'],
      symbol: 'BTC',
      type: {
        name: 'Bitcoin',
        parentChain: 'BTC',
      },
    },
  },
  XLM: {
    coinfig: {
      name: 'Stellar',
      precision: 7,
      products: ['PrivateKey'],
      symbol: 'XLM',
      type: {
        name: 'Stellar',
        parentChain: 'XLM',
      },
    },
  },
}
