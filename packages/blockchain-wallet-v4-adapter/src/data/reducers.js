
import { combineReducers } from 'redux'
import miscReducer from './misc/reducers'
import bchReducer from './bch/reducers'
import btcReducer from './btc/reducers'
import ethReducer from './eth/reducers'

export default combineReducers({
  misc: miscReducer,
  bch: bchReducer,
  btc: btcReducer,
  eth: ethReducer
})
