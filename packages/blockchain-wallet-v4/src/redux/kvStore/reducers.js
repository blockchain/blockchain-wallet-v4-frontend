import { combineReducers } from 'redux'
import whatsNew from './whatsNew/reducers.js'
import ethereum from './ethereum/reducers.js'
import shapeShift from './shapeShift/reducers.js'
import buySell from './buySell/reducers.js'
import contacts from './contacts/reducers.js'
import * as C from './config'

const kvStoreReducer = combineReducers({
  [C.WHATSNEW]: whatsNew,
  [C.ETHEREUM]: ethereum,
  [C.SHAPESHIFT]: shapeShift,
  [C.BUYSELL]: buySell,
  [C.CONTACTS]: contacts
})

export default kvStoreReducer
