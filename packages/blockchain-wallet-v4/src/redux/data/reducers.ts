import { combineReducers } from 'redux'
import bch from './bch/reducers'
import btc from './btc/reducers'
import eth from './eth/reducers'
import misc from './misc/reducers'
import xlm from './xlm/reducers'

const dataReducer = combineReducers({
  bch,
  btc,
  eth,
  misc,
  xlm
})

export default dataReducer
