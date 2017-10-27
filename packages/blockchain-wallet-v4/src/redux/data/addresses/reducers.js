import { assoc, dissoc, indexBy, prop, mapObjIndexed } from 'ramda'
import * as actionTypes from '../../actionTypes.js'
import * as AT from './actionTypes'

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
      const removeTxns = (num, key, obj) => dissoc('txns', num)
      return assoc('ethereum', mapObjIndexed(removeTxns, payload), state)
    }
    case AT.SET_ETHEREUM_ADDRESSES: {
      const { addresses } = payload
      return assoc('ethereum', )
    }
    default:
      return state
  }
}

export default addressesReducer
