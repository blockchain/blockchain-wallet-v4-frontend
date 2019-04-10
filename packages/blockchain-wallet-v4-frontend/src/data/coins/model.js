import { filter, keys } from 'ramda'

// TODO list:
// combine with or put this into wallet options
// update home page charts component to use this model
// move this model to core package and add the following data to model
//      blockchain-wallet-v4/src/redux/data/eth/model.js
//      blockchain-wallet-v4/src/exchange/currencies/PAX.js
//      blockchain-wallet-v4/src/redux/kvStore/eth/model.js

// COIN MODEL OVERVIEW
/*
 * name:              [REQUIRED] real name of coin/token (hidden from user)
 * displayName:       [REQUIRED] display name of coin/token (shown to user)
 * coinCode:          [REQUIRED] real coin code (hidden from user)
 * coinCodeDisplay:   [REQUIRED] display coin code (shown to user)
 * txExplorerBaseUrl: [REQUIRED] base url to coin/token tx explorer
 * icons:             [REQUIRED] map of the various icons for coin/token
 * minConfirmations:  [REQUIRED] confirmations needed for tx
 * isErc20:           [REQUIRED] bool indicating if the coin is an ERC20 token
 * hasLockboxSupport: [REQUIRED] bool indicating if the coin is available on lockbox
 * colorCode:         [REQUIRED] primary color of coin/token used for icons and text
 * txListAppRoute:    [OPTIONAL] app route for coin/token tx list page
 * learnMoreLink:     [OPTIONAL] external url explaining coin/token
 * campaign:          [OPTIONAL] string indicating active campaign for coin/token
 * airdrop:           [OPTIONAL] metadata about current campaign/airdrop
 * showNewTagSidenav: [OPTIONAL] show new tag in sidenav for coin/token (coin must be inSIDENAV_COIN_ORDER const)
 */
export const COIN_MODELS = {
  BTC: {
    campaign: null,
    coinCode: 'BTC',
    coinCodeDisplay: 'BTC',
    colorCode: 'btc',
    displayName: 'Bitcoin',
    hasLockboxSupport: true,
    icons: {
      default: 'btc',
      circle: 'btc-circle',
      circleFilled: 'btc-circle-filled'
    },
    isErc20: false,
    learnMoreLink: 'https://www.blockchain.com/learning-portal/bitcoin-faq',
    minConfirmations: 3,
    name: 'Bitcoin',
    txExplorerBaseUrl: 'https://blockchain.com/btc/tx',
    txListAppRoute: '/btc/transactions',
    showNewTagSidenav: false
  },
  BCH: {
    campaign: null,
    coinCode: 'BCH',
    coinCodeDisplay: 'BCH',
    colorCode: 'bch',
    displayName: 'Bitcoin Cash',
    hasLockboxSupport: true,
    icons: {
      default: 'bch',
      circle: 'bch-circle',
      circleFilled: 'bch-circle-filled'
    },
    isErc20: false,
    learnMoreLink: null,
    minConfirmations: 3,
    name: 'Bitcoin Cash',
    txExplorerBaseUrl: 'https://www.blockchain.com/bch/tx',
    txListAppRoute: '/bch/transactions',
    showNewTagSidenav: false
  },
  BSV: {
    campaign: null,
    coinCode: 'BSV',
    coinCodeDisplay: 'BSV',
    colorCode: 'bsv',
    displayName: 'Bitcoin SV',
    hasLockboxSupport: false,
    icons: {
      default: 'bsv'
    },
    isErc20: false,
    learnMoreLink: null,
    minConfirmations: 3,
    name: 'Bitcoin SV',
    txExplorerBaseUrl: 'https://blockchair.com/bitcoin-sv/transaction',
    txListAppRoute: null,
    showNewTagSidenav: false
  },
  ETH: {
    campaign: null,
    coinCode: 'ETH',
    coinCodeDisplay: 'ETH',
    colorCode: 'eth',
    displayName: 'Ethereum',
    hasLockboxSupport: true,
    icons: {
      default: 'eth',
      circle: 'eth-circle',
      circleFilled: 'eth-circle-filled'
    },
    isErc20: false,
    learnMoreLink: 'https://www.blockchain.com/learning-portal/ether-basics',
    minConfirmations: 12,
    name: 'Ethereum',
    txExplorerBaseUrl: 'https://www.blockchain.com/eth/tx',
    txListAppRoute: '/eth/transactions',
    showNewTagSidenav: false
  },
  PAX: {
    campaign: null,
    coinCode: 'PAX',
    coinCodeDisplay: 'USDp',
    colorCode: 'pax',
    displayName: 'USD Pax',
    hasLockboxSupport: false,
    icons: {
      default: 'usdp',
      circle: 'usdp',
      circleFilled: 'usdp'
    },
    isErc20: true,
    learnMoreLink: null,
    minConfirmations: 12,
    name: 'Paxos',
    txExplorerBaseUrl: 'https://www.blockchain.com/eth/tx',
    txListAppRoute: '/pax/transactions',
    showNewTagSidenav: true
  },
  XLM: {
    airdrop: {
      name: 'SUNRIVER',
      link:
        'https://support.blockchain.com/hc/en-us/categories/360001126692-Crypto-Giveaway',
      image: 'stellar-planet'
    },
    colorCode: 'xlm',
    campaign: 'sunriver',
    coinCode: 'XLM',
    coinCodeDisplay: 'XLM',
    displayName: 'Stellar',
    hasLockboxSupport: true,
    icons: {
      default: 'xlm',
      circle: 'xlm-circle',
      circleFilled: 'xlm-circle-filled'
    },
    isErc20: false,
    learnMoreLink: '',
    minConfirmations: 1,
    name: 'Stellar',
    txExplorerBaseUrl: 'https://stellarchain.io/tx',
    txListAppRoute: '/xlm/transactions',
    showNewTagSidenav: false
  }
}

// list of supported ERC 20 tokens
export const ERC20_COIN_LIST = keys(filter(c => c.isErc20, COIN_MODELS))
