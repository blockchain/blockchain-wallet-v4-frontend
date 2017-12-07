import { combineReducers } from 'redux'
import bitcoin from './bitcoin/reducers'
import ethereum from './ethereum/reducers'
import misc from './misc/reducers'
import shapeShift from './shapeShift/reducers'

const dataReducer = combineReducers({
  bitcoin: bitcoin,
  ethereum: ethereum,
  misc: misc,
  shapeShift: shapeShift
})

export default dataReducer
