import { combineReducers } from 'redux'
import addresses from './data/Addresses/reducers.js'
import latestBlock from './data/LatestBlock/reducers.js'
import transactions from './data/Transactions/reducers.js'
import walletInfo from './data/Wallet/reducers.js'
import wallet from './wallet/reducers.js'

const data = combineReducers({
  addresses: addresses,
  latest_block: latestBlock,
  txs: transactions,
  wallet: walletInfo
})

export {
  data,
  wallet
}
