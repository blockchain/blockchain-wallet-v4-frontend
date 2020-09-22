import * as C from './config'
import { combineReducers } from 'redux'
import bch from './bch/reducers'
import btc from './btc/reducers'
import buySell from './buySell/reducers'
import contacts from './contacts/reducers'
import eth from './eth/reducers'
import lockbox from './lockbox/reducers'
import root from './root/reducers'
import userCredentials from './userCredentials/reducers'
import whatsNew from './whatsNew/reducers'
import xlm from './xlm/reducers'

const kvStoreReducer = combineReducers({
  [C.ROOT]: root,
  [C.WHATSNEW]: whatsNew,
  [C.ETH]: eth,
  [C.BUYSELL]: buySell,
  [C.CONTACTS]: contacts,
  [C.BCH]: bch,
  [C.BTC]: btc,
  [C.LOCKBOX]: lockbox,
  [C.USER_CREDENTIALS]: userCredentials,
  [C.XLM]: xlm
})

export default kvStoreReducer
