import { assoc, merge } from 'ramda'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes.js'
import * as RD from '../../remoteData'

const INITIAL_STATE = {
  addresses: {},
  fee: RD.Loading(),
  info: {},
  latest_block: RD.Loading(),
  legacy: {},
  rates: RD.Loading(),
  transactions: RD.Loading()
}

const ethereumReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case actionTypes.common.ethereum.SET_ETHEREUM_DATA: {
      return merge(state, payload)
    }
    case AT.FETCH_ETHEREUM_FEE: {
      return assoc('fee', RD.Loading(), state)
    }
    case AT.FETCH_ETHEREUM_FEE_SUCCESS: {
      return assoc('fee', RD.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_FEE_FAILURE: {
      return assoc('fee', RD.Failed(payload), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK: {
      return assoc('latest_block', RD.Loading(), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_SUCCESS: {
      return assoc('latest_Block', RD.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_FAILURE: {
      return assoc('latest_block', RD.Failed(payload), state)
    }
    case AT.FETCH_ETHEREUM_RATES: {
      return assoc('rates', RD.Loading(), state)
    }
    case AT.FETCH_ETHEREUM_RATES_SUCCESS: {
      return assoc('rates', RD.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_RATES_FAILURE: {
      return assoc('rates', RD.Failed(payload), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTIONS: {
      return assoc('transactions', RD.Loading(), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTION_SUCCESS: {
      return assoc('transactions', RD.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTION_FAILURE: {
      return assoc('transactions', RD.Failed(payload), state)
    }
    default:
      return state
  }
}

export default ethereumReducer
