import { combineReducers } from 'redux'
import bitcoin from './bitcoin/reducers'
import ethereum from './ethereum/reducers'
import bch from './bch/reducers'
import misc from './misc/reducers'
import sfox from './sfox/reducers'
import coinify from './coinify/reducers'
import shapeShift from './shapeShift/reducers'

const dataReducer = combineReducers({
  bitcoin: bitcoin,
  coinify: coinify,
  ethereum: ethereum,
  bch: bch,
  misc: misc,
  sfox: sfox,
  shapeShift: shapeShift
})

export default dataReducer
