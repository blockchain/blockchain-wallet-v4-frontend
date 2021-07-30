import { combineReducers } from 'redux'

import bch from './bch/reducers'
import btc from './btc/reducers'
import { coinsReducer } from './coins/reducers'
import { custodialReducer } from './custodial/reducers'
import eth from './eth/reducers'
import { fiatReducer } from './fiat/reducers'
import { miscReducer } from './misc/reducers'
import xlm from './xlm/reducers'

const dataReducer = combineReducers({
  bch,
  btc,
  coins: coinsReducer,
  custodial: custodialReducer,
  eth,
  fiat: fiatReducer,
  misc: miscReducer,
  xlm
})

export default dataReducer
