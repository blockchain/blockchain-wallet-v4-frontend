import { combineReducers } from 'redux'

import bch from './bch/reducers'
import bitcoin from './btc/reducers'
import bsv from './bsv/reducers'
import coinify from './coinify/reducers'
import ethereum from './eth/reducers'
import misc from './misc/reducers'
import sfox from './sfox/reducers'
import shapeShift from './shapeShift/reducers'
import xlm from './xlm/reducers'

// TODO: rename exports as coin codes
const dataReducer = combineReducers({
  bch,
  bitcoin,
  bsv,
  coinify,
  ethereum,
  misc,
  sfox,
  shapeShift,
  xlm
})

export default dataReducer
