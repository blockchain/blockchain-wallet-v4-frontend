import { combineReducers } from 'redux'
import addresses from './data/addresses/reducers.js'
import adverts from './data/adverts/reducers.js'
import captcha from './data/captcha/reducers.js'
import charts from './data/charts/reducers.js'
import fee from './data/fee/reducers.js'
import latestBlock from './data/latestBlock/reducers.js'
import logs from './data/logs/reducers.js'
import payment from './data/payment/reducers'
import transactions from './data/transactions/reducers.js'
import transactionFiats from './data/transactionFiats/reducers.js'
import info from './data/info/reducers.js'
import rates from './data/rates/reducers.js'
import wallet from './wallet/reducers.js'
import settings from './settings/reducers.js'
import walletOptions from './walletOptions/reducers.js'

const data = combineReducers({
  addresses,
  adverts,
  captcha,
  charts,
  fee,
  latest_block: latestBlock,
  logs,
  txs: transactions,
  txs_fiat: transactionFiats,
  info,
  rates,
  payment
})

export {
  data,
  wallet,
  settings,
  walletOptions
}
