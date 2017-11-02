import { assoc, merge } from 'ramda'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes.js'

const INITIAL_STATE = {
  addresses: {},
  fee: {},
  info: {},
  latest_block: {},
  rates: {},
  transactions: {}
}

const ethereumReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case actionTypes.common.SET_ETHEREUM_DATA: {
      return merge(state, payload)
    }
    case AT.SET_ETHEREUM_FEE: {
      return assoc('fee', payload, state)
    }
    case AT.SET_ETHEREUM_RATES: {
      return assoc('rates', payload, state)
    }
    default:
      return state
  }
}

export default ethereumReducer
