import { assoc, indexBy, prop } from 'ramda'
import * as actionTypes from '../../actionTypes.js'

const INITIAL_STATE = {
  'bitcoin': {},
  'ethereum': {}
}

const addressesReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case actionTypes.common.SET_BLOCKCHAIN_DATA: {
      const addresses = prop('addresses', payload)
      return assoc('bitcoin', indexBy(prop('address'), addresses), state)
    }
    case actionTypes.common.SET_ETHEREUM_DATA: {
      const addresses = prop('addresses', payload)
      return assoc('ethereum', addresses, state)
    }
    default:
      return state
  }
}

export default addressesReducer
