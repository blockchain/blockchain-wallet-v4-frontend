import { combineReducers } from 'redux'

import { algoReducer } from './algo/reducers'
import bch from './bch/reducers'
import btc from './btc/reducers'
import { custodialReducer } from './custodial/reducers'
import dot from './dot/reducers'
import eth from './eth/reducers'
import { fiatReducer } from './fiat/reducers'
import { miscReducer } from './misc/reducers'
import xlm from './xlm/reducers'

const dataReducer = combineReducers({
  algo: algoReducer,
  bch,
  btc,
  custodial: custodialReducer,
  dot,
  eth,
  fiat: fiatReducer,
  misc: miscReducer,
  xlm
})

export default dataReducer
