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
      removeListener: function () {}
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
        parentChain: 'BTC'
      }
    }
  },
  AAVE: {
    coinfig: {
      symbol: 'AAVE',
      name: 'Aave',
      type: {
        name: 'ERC20',
        parentChain: 'ETH',
        erc20Address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        logoPngUrl:
          'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
        websiteUrl: 'https://aave.com'
      },
      precision: 18,
      products: [
        'MercuryDeposits',
        'MercuryWithdrawals',
        'InterestBalance',
        'CustodialWalletBalance',
        'PrivateKey'
      ]
    }
  },
  XLM: {
    coinfig: {
      name: 'Stellar',
      precision: 7,
      products: ['PrivateKey'],
      symbol: 'XLM',
      type: {
        name: 'Stellar',
        parentChain: 'XLM'
      }
    }
  }
}
