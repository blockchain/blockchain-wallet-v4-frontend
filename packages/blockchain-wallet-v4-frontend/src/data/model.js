import { filter } from 'ramda'
import * as analytics from './analytics/model'
import * as components from './components/model'
import * as form from './form/model'
import * as logs from './logs/model'
import * as profile from './modules/profile/model'
import * as rates from './modules/rates/model'

// TODO list:
// update all components to use primary color code from this model instead of info-components theme
// update home page balance component to use this model
// update home page charts component to use this model
// move this model to core package and add the following data to model
//      blockchain-wallet-v4/src/redux/data/eth/model.js
//      blockchain-wallet-v4/src/exchange/currencies/PAX.js
//      blockchain-wallet-v4/src/redux/kvStore/eth/model.js

// COIN MODEL OVERVIEW
/*
 * fullSupport:       [REQUIRED] bool indicating if coin has sidenav link, send & request
 * name:              [REQUIRED] real name of coin/token (hidden from user)
 * displayName:       [REQUIRED] display name of coin/token (shown to user)
 * coinCode:          [REQUIRED] real coin code (hidden from user)
 * coinCodeDisplay:   [REQUIRED] display coin code (shown to user)
 * txExplorerBaseUrl: [REQUIRED] base url to coin/token tx explorer
 * iconName:          [REQUIRED] name of the icon for coin/token
 * minConfirmations:  [REQUIRED] confirmations needed for tx
 * isErc20:           [REQUIRED] bool indicating if the coin is an ERC20 token
 * primaryColor:      [REQUIRED] primary color of coin/token used for icons and text
 * txListAppRoute:    [OPTIONAL] app route for coin/token tx list page
 * learnMoreLink:     [OPTIONAL] external url explaining coin/token
 * campaign:          [OPTIONAL] string indicating active campaign for coin/token
 * airdrop:           [OPTIONAL] metadata about current campaign/airdrop
 * showNewTagSidenav: [OPTIONAL] show new tag in sidenav for coin/token (coin must be inSIDENAV_COIN_ORDER const)
 */
const COIN_MODELS = {
  BTC: {
    campaign: null,
    coinCode: 'BTC',
    coinCodeDisplay: 'BTC',
    displayName: 'Bitcoin',
    fullSupport: true,
    iconName: 'btc-circle',
    isErc20: false,
    learnMoreLink: 'https://www.blockchain.com/learning-portal/bitcoin-faq',
    minConfirmations: 3,
    name: 'Bitcoin',
    txExplorerBaseUrl: 'https://blockchain.com/btc/tx',
    txListAppRoute: '/btc/transactions',
    showNewTagSidenav: false,
    primaryColor: '#FF9B22'
  },
  BCH: {
    campaign: null,
    coinCode: 'BCH',
    coinCodeDisplay: 'BCH',
    displayName: 'Bitcoin Cash',
    fullSupport: true,
    iconName: 'bch-circle',
    isErc20: false,
    learnMoreLink: null,
    minConfirmations: 3,
    name: 'Bitcoin Cash',
    txExplorerBaseUrl: 'https://www.blockchain.com/bch/tx',
    txListAppRoute: '/bch/transactions',
    showNewTagSidenav: false,
    primaryColor: '#3EDC89'
  },
  BSV: {
    campaign: null,
    coinCode: 'BSV',
    coinCodeDisplay: 'BSV',
    displayName: 'Bitcoin SV',
    fullSupport: false,
    iconName: 'bsv',
    isErc20: false,
    learnMoreLink: null,
    minConfirmations: 3,
    name: 'Bitcoin SV',
    txExplorerBaseUrl: 'https://blockchair.com/bitcoin-sv/transaction',
    txListAppRoute: null,
    showNewTagSidenav: false,
    primaryColor: '#EAB300'
  },
  ETH: {
    campaign: null,
    coinCode: 'ETH',
    coinCodeDisplay: 'ETH',
    displayName: 'Ethereum',
    fullSupport: true,
    iconName: 'eth-circle',
    isErc20: false,
    learnMoreLink: 'https://www.blockchain.com/learning-portal/ether-basics',
    minConfirmations: 12,
    name: 'Ethereum',
    txExplorerBaseUrl: 'https://www.blockchain.com/eth/tx',
    txListAppRoute: '/eth/transactions',
    showNewTagSidenav: false,
    primaryColor: '#473BCB'
  },
  PAX: {
    campaign: null,
    coinCode: 'PAX',
    coinCodeDisplay: 'USDp',
    displayName: 'USD Pax',
    fullSupport: true,
    iconName: 'dollars',
    isErc20: true,
    learnMoreLink: null,
    minConfirmations: 12,
    name: 'Paxos',
    txExplorerBaseUrl: 'https://www.blockchain.com/eth/tx', // TODO
    txListAppRoute: '/pax/transactions',
    showNewTagSidenav: true,
    primaryColor: '#0C6CF2'
  },
  XLM: {
    airdrop: {
      name: 'SUNRIVER',
      link:
        'https://support.blockchain.com/hc/en-us/categories/360001126692-Crypto-Giveaway',
      image: 'stellar-planet'
    },
    campaign: 'sunriver',
    coinCode: 'XLM',
    coinCodeDisplay: 'XLM',
    displayName: 'Stellar',
    fullSupport: true,
    iconName: 'xlm-circle',
    isErc20: false,
    learnMoreLink: '',
    minConfirmations: 1,
    name: 'Stellar',
    txExplorerBaseUrl: 'https://stellarchain.io/tx',
    txListAppRoute: '/xlm/transactions',
    showNewTagSidenav: false,
    primaryColor: '#08b5e5'
  }
}

// TODO: dont export this list, instead build list of coin models in correct order
const SIDENAV_COIN_ORDER = ['PAX', 'BTC', 'ETH', 'BCH', 'XLM']

const coins = {
  COIN_MODELS,
  FULL_SUPPORT_COINS: filter(c => c.fullSupport, COIN_MODELS),
  SIDENAV_COIN_ORDER
}

export { analytics, coins, components, form, logs, profile, rates }
