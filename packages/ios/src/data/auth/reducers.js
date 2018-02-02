// -- EXPOSE AUTHENTICATION REDUCERS -- //
import * as AT from './actionTypes'
import { assoc } from 'ramda'
import { combineReducers } from 'redux'

const INITIAL_STATE = {
  wallet: null
}

const authReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  console.log('Auth Reducer:', 'I just received a message of type ' + type)
  switch(type) {
    case AT.LOGIN:
      return assoc('isLoggingIn', true, state)
    case AT.STORE_WALLET_PAYLOAD:
      return payload.wallet ? assoc('wallet', payload.wallet, state) : state
    default:
      return state
  }
}

export default authReducer
