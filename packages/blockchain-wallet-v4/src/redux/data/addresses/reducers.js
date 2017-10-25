import { assoc, dissoc, indexBy, prop, mapObjIndexed } from 'ramda'
import * as T from '../../actionTypes.js'

const INITIAL_STATE = {
  'bitcoin': {},
  'ethereum': {}
}

const addressesReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.common.SET_BLOCKCHAIN_DATA: {
      const addresses = prop('addresses', payload)
      return assoc('bitcoin', indexBy(prop('address'), addresses), state)
    }
    case T.common.SET_ETHEREUM_DATA: {
      const removeTxns = (num, key, obj) => dissoc('txns', num)
      return assoc('ethereum', mapObjIndexed(removeTxns, payload), state)
    }
    default:
      return state
  }
}

export default addressesReducer
