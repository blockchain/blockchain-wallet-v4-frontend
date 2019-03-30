// import { keys } from 'ramda'
import * as analytics from './analytics/model'
import * as components from './components/model'
import * as form from './form/model'
import * as logs from './logs/model'
import * as profile from './modules/profile/model'
import * as rates from './modules/rates/model'

// TODO:
// blockchain-wallet-v4/src/redux/data/eth/model.js
// blockchain-wallet-v4/src/exchange/currencies/PAX.js
// /blockchain-wallet-v4/src/redux/kvStore/eth/model.js

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
 * learnMoreLink:     [OPTIONAL] external url explaining coin/token
 * campaign:          [OPTIONAL] string indicating active campaign for coin/token
 * airdrop:           [OPTIONAL] metadata about current campaign/airdrop
 */
const COIN_MODELS = {
  BTC: {
    campaign: null,
    coinCode: 'BTC',
    coinCodeDisplay: 'BTC',
    displayName: 'Bitcoin',
    fullSupport: true,
    iconName: 'btc',
    isErc20: false,
    learnMoreLink: 'https://www.blockchain.com/learning-portal/bitcoin-faq',
    minConfirmations: 3,
    name: 'Bitcoin',
    txExplorerBaseUrl: 'https://blockchain.com/btc/tx'
  },
  BCH: {
    campaign: null,
    coinCode: 'BCH',
    coinCodeDisplay: 'BCH',
    displayName: 'Bitcoin Cash',
    fullSupport: true,
    iconName: 'bch',
    isErc20: false,
    learnMoreLink: null,
    minConfirmations: 3,
    name: 'Bitcoin Cash',
    txExplorerBaseUrl: 'https://www.blockchain.com/bch/tx'
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
    txExplorerBaseUrl: 'https://blockchair.com/bitcoin-sv/transaction'
  },
  ETH: {
    campaign: null,
    coinCode: 'ETH',
    coinCodeDisplay: 'ETH',
    displayName: 'Ethereum',
    fullSupport: true,
    iconName: 'eth',
    isErc20: false,
    learnMoreLink: 'https://www.blockchain.com/learning-portal/ether-basics',
    minConfirmations: 12,
    name: 'Ethereum',
    txExplorerBaseUrl: 'https://www.blockchain.com/eth/tx'
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
    txExplorerBaseUrl: 'https://www.blockchain.com/eth/tx'
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
    iconName: 'xlm',
    isErc20: false,
    learnMoreLink: '',
    minConfirmations: 1,
    name: 'Stellar',
    txExplorerBaseUrl: 'https://stellarchain.io/tx'
  }
}

const coins = {
  COIN_MODELS
  // supportedCoinList: keys(coinModels)
}

export { analytics, coins, components, form, logs, profile, rates }
