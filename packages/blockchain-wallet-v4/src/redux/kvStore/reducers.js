import { combineReducers } from 'redux'
import whatsNew from './whatsNew/reducers.js'
import ethereum from './eth/reducers.js'
import shapeShift from './shapeShift/reducers.js'
import buySell from './buySell/reducers.js'
import contacts from './contacts/reducers.js'
import root from './root/reducers.js'
import bch from './bch/reducers.js'
import btc from './btc/reducers.js'
import * as C from './config'

const kvStoreReducer = combineReducers({
  [C.ROOT]: root,
  [C.WHATSNEW]: whatsNew,
  [C.ETHEREUM]: ethereum,
  [C.SHAPESHIFT]: shapeShift,
  [C.BUYSELL]: buySell,
  [C.CONTACTS]: contacts,
  [C.BCH]: bch,
  [C.BTC]: btc
})

export default kvStoreReducer
