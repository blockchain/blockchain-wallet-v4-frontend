import peer from './peers/reducers.js'
import channel from './channel/reducers.js'
import root from './root/reducers.js'
import payment from './payment/reducers'

import {combineReducers} from 'redux'

const lnReducer = combineReducers({
  peer,
  channel,
  root,
  payment
})

export default lnReducer
