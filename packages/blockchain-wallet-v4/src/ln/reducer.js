import peer from './peers/reducers.js'
import channel from './channel/reducers.js'
import {combineReducers} from "redux";

const lnReducer = combineReducers({
  peer,
  channel
})

export default lnReducer
