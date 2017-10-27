import { assoc, prop } from 'ramda'
import * as actionTypes from '../../actionTypes.js'

const INITIAL_STATE = {
  'bitcoin': {},
  'ethereum': {}
}

const infoReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case actionTypes.common.SET_BLOCKCHAIN_DATA: {
      const wallet = prop('wallet', payload)
      return assoc('bitcoin', wallet, state)
    }
    case actionTypes.common.SET_ETHEREUM_DATA: {
      const info = prop('info', payload)
      return assoc('ethereum', info, state)
    }
    default:
      return state
  }
}

export default infoReducer
