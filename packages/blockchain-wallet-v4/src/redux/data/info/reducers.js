import { assoc, prop } from 'ramda'
import * as actionTypes from '../../actionTypes.js'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  'bitcoin': {},
  'ethereum': {}
}

const infoReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case actionTypes.common.SET_BLOCKCHAIN_DATA: {
      return assoc('bitcoin', prop('wallet', payload), state)
    }
    case AT.SET_ETHER_BALANCE: {
      const { balance } = payload
      return assoc('final_balance', balance, state)
    }

    default:
      return state
  }
}

export default infoReducer
