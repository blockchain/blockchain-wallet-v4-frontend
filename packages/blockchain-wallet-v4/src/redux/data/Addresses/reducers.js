import { indexBy, prop } from 'ramda'
import * as T from '../../actionTypes.js'

const INITIAL_STATE = []

const addressesReducer = (state = INITIAL_STATE, action) => {
  let { type } = action
  switch (type) {
    case T.common.FETCH_BLOCKCHAIN_DATA_SUCCESS: {
      const { payload } = action
      const addresses = prop('addresses', payload)
      return indexBy(prop('address'), addresses)
    }
    default:
      return state
  }
}

export default addressesReducer
