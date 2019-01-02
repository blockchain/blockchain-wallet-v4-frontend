import { combineReducers } from 'redux'
import whatsNew from './whatsNew/reducers'
import ethereum from './eth/reducers'
import shapeShift from './shapeShift/reducers'
import buySell from './buySell/reducers'
import contacts from './contacts/reducers'
import root from './root/reducers'
import bch from './bch/reducers'
import btc from './btc/reducers'
import bsv from './bsv/reducers'
import lockbox from './lockbox/reducers'
import userCredentials from './userCredentials/reducers'
import xlm from './xlm/reducers'
import * as C from './config'

const kvStoreReducer = combineReducers({
  [C.ROOT]: root,
  [C.WHATSNEW]: whatsNew,
  [C.ETHEREUM]: ethereum,
  [C.SHAPESHIFT]: shapeShift,
  [C.BUYSELL]: buySell,
  [C.CONTACTS]: contacts,
  [C.BCH]: bch,
  [C.BTC]: btc,
  [C.BSV]: bsv,
  [C.LOCKBOX]: lockbox,
  [C.USER_CREDENTIALS]: userCredentials,
  [C.XLM]: xlm
})

export default kvStoreReducer
