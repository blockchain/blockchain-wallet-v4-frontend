import { assoc, merge } from 'ramda'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes.js'

const INITIAL_STATE = {
  addresses: {},
  fee: {},
  info: {},
  latest_block: {},
  legacy: {},
  rates: {},
  transactions: {}
}

const ethereumReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case actionTypes.common.ethereum.SET_ETHEREUM_DATA: {
      return merge(state, payload)
    }
    case AT.SET_ETHEREUM_FEE: {
      const { data } = payload
      return assoc('fee', data, state)
    }
    case AT.SET_ETHEREUM_RATES: {
      const { data } = payload
      return assoc('rates', data, state)
    }
    case AT.SET_ETHEREUM_LATEST_BLOCK: {
      const { data } = payload
      return assoc('latest_block', data, state)
    }
    default:
      return state
  }
}

export default ethereumReducer
