import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import '@babel/polyfill'
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('../../tsconfig')

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
      symbol: 'BTC',
      displaySymbol: 'BTC',
      name: 'Bitcoin',
      type: {
        name: 'COIN',
        minimumOnChainConfirmations: 2,
        logoPngUrl:
          'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/bitcoin/info/logo.png',
        websiteUrl: 'https://bitcoin.org'
      },
      precision: 8,
      products: [
        'MercuryDeposits',
        'MercuryWithdrawals',
        'InterestBalance',
        'CustodialWalletBalance',
        'PrivateKey'
      ]
    }
  },
  ETH: {
    coinfig: {
      symbol: 'ETH',
      displaySymbol: 'ETH',
      name: 'Ethereum',
      type: {
        name: 'COIN',
        minimumOnChainConfirmations: 64,
        logoPngUrl:
          'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/info/logo.png',
        websiteUrl: 'https://ethereum.org/'
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
  AAVE: {
    coinfig: {
      symbol: 'AAVE',
      displaySymbol: 'AAVE',
      name: 'Aave',
      type: {
        parentChain: 'ETH',
        erc20Address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        logoPngUrl:
          'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
        websiteUrl: 'https://aave.com',
        name: 'ERC20'
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
      symbol: 'XLM',
      displaySymbol: 'XLM',
      name: 'Stellar Lumen',
      type: {
        name: 'COIN',
        minimumOnChainConfirmations: 1,
        logoPngUrl:
          'https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/stellar/info/logo.png'
      },
      precision: 7,
      products: [
        'MercuryDeposits',
        'MercuryWithdrawals',
        'InterestBalance',
        'CustodialWalletBalance',
        'PrivateKey'
      ]
    }
  },
  AVAX: {
    coinfig: {
      symbol: 'AVAX',
      displaySymbol: 'AVAX',
      name: 'Avalanche C-Chain',
      type: {
        name: 'COIN',
        minimumOnChainConfirmations: 30,
        logoPngUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png',
        websiteUrl: 'http://avax.network'
      },
      precision: 18,
      products: []
    }
  },
  USD: {
    coinfig: {
      symbol: 'USD',
      displaySymbol: 'USD',
      name: 'US Dollar',
      type: {
        name: 'FIAT'
      },
      precision: 2,
      products: ['MercuryDeposits', 'MercuryWithdrawals', 'CustodialWalletBalance']
    }
  }
}

module.exports = {
  modulePaths: ['<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' })
}
