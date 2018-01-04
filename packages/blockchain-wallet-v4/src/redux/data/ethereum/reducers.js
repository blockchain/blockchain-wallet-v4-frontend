import { assoc, merge, prop } from 'ramda'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes.js'
import * as RD from '../../remoteData'

const INITIAL_STATE = {
  addresses: RD.NotAsked(),
  fee: RD.NotAsked(),
  info: RD.NotAsked(),
  latest_block: RD.NotAsked(),
  rates: RD.NotAsked(),
  transactions: RD.NotAsked()
}

const ethereumReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case actionTypes.common.ethereum.SET_ETHEREUM_DATA: {
      return merge(state, payload)
    }
    case AT.FETCH_ETHEREUM_DATA_LOADING: {
      const newState = {
        addresses: RD.Loading(),
        info: RD.Loading(),
        transactions: RD.Loading()
      }
      return merge(state, newState)
    }
    case AT.FETCH_ETHEREUM_DATA_SUCCESS: {
      const newState = {
        addresses: RD.Success(prop('addresses', payload)),
        info: RD.Success(prop('info', payload)),
        transactions: RD.Success(prop('transactions', payload))
      }
      return merge(state, newState)
    }
    case AT.FETCH_ETHEREUM_DATA_FAILURE: {
      const newState = {
        addresses: RD.Failed(prop('addresses', payload)),
        info: RD.Failed(prop('info', payload)),
        transactions: RD.Failed(prop('transactions', payload))
      }
      return merge(state, newState)
    }
    case AT.FETCH_ETHEREUM_FEE_LOADING: {
      return assoc('fee', RD.Loading(), state)
    }
    case AT.FETCH_ETHEREUM_FEE_SUCCESS: {
      return assoc('fee', RD.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_FEE_FAILURE: {
      return assoc('fee', RD.Failed(payload), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_LOADING: {
      return assoc('latest_block', RD.Loading(), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_SUCCESS: {
      return assoc('latest_Block', RD.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_FAILURE: {
      return assoc('latest_block', RD.Failed(payload), state)
    }
    case AT.FETCH_ETHEREUM_RATES_LOADING: {
      return assoc('rates', RD.Loading(), state)
    }
    case AT.FETCH_ETHEREUM_RATES_SUCCESS: {
      return assoc('rates', RD.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_RATES_FAILURE: {
      return assoc('rates', RD.Failed(payload), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTIONS_LOADING: {
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
