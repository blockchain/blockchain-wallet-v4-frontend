import peer from './peers/reducers.js'
import channel from './channel/reducers.js'
import root from './root/reducers.js'

import {combineReducers} from "redux";

const lnReducer = combineReducers({
  peer,
  channel,
  root
})

export default lnReducer
