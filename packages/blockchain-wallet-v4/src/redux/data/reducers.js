import { combineReducers } from 'redux'
import addresses from './addresses/reducers'
import adverts from './adverts/reducers'
import captcha from './captcha/reducers'
import charts from './charts/reducers'
import fee from './fee/reducers'
import info from './info/reducers'
import latestBlock from './latestBlock/reducers'
import logs from './logs/reducers'
import payment from './payment/reducers'
import rates from './rates/reducers'
import reports from './reports/reducers'
import transactionFiats from './transactionFiats/reducers'
import transactions from './transactions/reducers'

const dataReducer = combineReducers({
  addresses: addresses,
  adverts: adverts,
  captcha: captcha,
  charts: charts,
  fee: fee,
  info: info,
  latest_block: latestBlock,
  logs: logs,
  payment: payment,
  rates: rates,
  reports: reports,
  txs: transactions,
  txs_fiat: transactionFiats
})

export default dataReducer
