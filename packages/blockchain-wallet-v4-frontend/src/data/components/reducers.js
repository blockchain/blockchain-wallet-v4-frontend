import { combineReducers } from 'redux'
import sendBtcReducer from './sendBtc/reducers'

export default combineReducers({
  sendBtc: sendBtcReducer
})
