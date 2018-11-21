import { combineReducers } from 'redux'
import bitcoin from './btc/reducers'
import coinify from './coinify/reducers'
import ethereum from './eth/reducers'
import bch from './bch/reducers'
import misc from './misc/reducers'
import sfox from './sfox/reducers'
import shapeShift from './shapeShift/reducers'
import xlm from './xlm/reducers'

const dataReducer = combineReducers({
  bitcoin,
  coinify,
  ethereum,
  bch,
  misc,
  sfox,
  shapeShift,
  xlm
})

export default dataReducer
