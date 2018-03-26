
import { combineReducers } from 'redux'
import bchReducer from './bch/reducers'
import btcReducer from './btc/reducers'
import ethReducer from './eth/reducers'
import miscReducer from './misc/reducers'
import shapeshiftReducer from './shapeshift/reducers'

export default combineReducers({
  bch: bchReducer,
  btc: btcReducer,
  eth: ethReducer,
  misc: miscReducer,
  shapeshift: shapeshiftReducer
})
