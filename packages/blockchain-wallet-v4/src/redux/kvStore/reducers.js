import { combineReducers } from 'redux'

import bch from './bch/reducers'
import btc from './btc/reducers'
import * as C from './config'
import eth from './eth/reducers'
import lockbox from './lockbox/reducers'
import root from './root/reducers'
import userCredentials from './userCredentials/reducers'
import walletCredentials from './walletCredentials/reducers'
import xlm from './xlm/reducers'

const kvStoreReducer = combineReducers({
  [C.ROOT]: root,
  [C.ETH]: eth,
  [C.BCH]: bch,
  [C.BTC]: btc,
  [C.LOCKBOX]: lockbox,
  [C.USER_CREDENTIALS]: userCredentials,
  [C.XLM]: xlm,
  [C.WALLET_CREDENTIALS]: walletCredentials
})

export default kvStoreReducer
