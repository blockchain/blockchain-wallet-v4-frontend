import { assoc, merge, prop } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  addresses: Remote.NotAsked,
  fee: Remote.NotAsked,
  info: Remote.NotAsked,
  rates: Remote.NotAsked,
  transactions: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_ETH_DATA_LOADING: {
      return merge(state, {
        addresses: Remote.Loading,
        info: Remote.Loading,
        transactions: Remote.Loading
      })
    }
    case AT.FETCH_ETH_DATA_SUCCESS: {
      return merge(state, {
        addresses: Remote.Success(prop('addresses', payload)),
        info: Remote.Success(prop('info', payload)),
        transactions: Remote.Success(prop('transactions', payload))
      })
    }
    case AT.FETCH_ETH_DATA_FAILURE: {
      return merge(state, {
        addresses: Remote.Failure(prop('addresses', payload)),
        info: Remote.Failure(prop('info', payload)),
        transactions: Remote.Failure(prop('transactions', payload))
      })
    }
    case AT.FETCH_ETH_FEE_LOADING: {
      return assoc('fee', Remote.Loading, state)
    }
    case AT.FETCH_ETH_FEE_SUCCESS: {
      return assoc('fee', Remote.Success(payload), state)
    }
    case AT.FETCH_ETH_FEE_FAILURE: {
      return assoc('fee', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETH_RATES_LOADING: {
      return assoc('rates', Remote.Loading, state)
    }
    case AT.FETCH_ETH_RATES_SUCCESS: {
      return assoc('rates', Remote.Success(payload), state)
    }
    case AT.FETCH_ETH_RATES_FAILURE: {
      return assoc('rates', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}
