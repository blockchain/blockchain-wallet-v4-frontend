import { combineReducers } from 'redux'
import addresses from './data/Addresses/reducers.js'
import adverts from './data/Adverts/reducers.js'
import captcha from './data/Captcha/reducers.js'
import fee from './data/Fee/reducers.js'
import latestBlock from './data/LatestBlock/reducers.js'
import logs from './data/Logs/reducers.js'
import transactions from './data/Transactions/reducers.js'
import info from './data/Info/reducers.js'
import btcRates from './data/Rates/bitcoin/reducers.js'
import ethRates from './data/Rates/ether/reducers.js'
import wallet from './wallet/reducers.js'
import settings from './settings/reducers.js'
import walletOptions from './walletOptions/reducers.js'
import payment from './data/Payment/reducers'

const data = combineReducers({
  addresses: addresses,
  adverts: adverts,
  captcha: captcha,
  fee: fee,
  latest_block: latestBlock,
  logs,
  txs: transactions,
  info: info,
  btcRates: btcRates,
  ethRates: ethRates,
  payment
})

export {
  data,
  wallet,
  settings,
  walletOptions
}
