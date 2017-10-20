import { combineReducers } from 'redux'
import whatsNew from './whatsNew/reducers.js'
import ethereum from './ethereum/reducers.js'
import * as C from './config'

const kvStoreReducer = combineReducers({
  [C.WHATSNEW]: whatsNew,
  [C.ETHEREUM]: ethereum
})

export default kvStoreReducer
