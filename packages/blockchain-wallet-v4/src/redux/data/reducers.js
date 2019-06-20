import { combineReducers } from 'redux'

import bch from './bch/reducers'
import btc from './btc/reducers'
import coinify from './coinify/reducers'
import eth from './eth/reducers'
import misc from './misc/reducers'
import sfox from './sfox/reducers'
import shapeShift from './shapeShift/reducers'
import xlm from './xlm/reducers'

const dataReducer = combineReducers({
  bch,
  btc,
  coinify,
  eth,
  misc,
  sfox,
  shapeShift,
  xlm
})

export default dataReducer
