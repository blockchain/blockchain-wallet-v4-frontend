import { assoc, merge, lensProp, over, append, compose, dropLast, prop } from 'ramda'
import * as AT from './actionTypes'
import Remote from '../../../remote'

const INITIAL_STATE = {
  addresses: Remote.NotAsked,
  fee: Remote.NotAsked,
  info: Remote.NotAsked,
  latest_block: Remote.NotAsked,
  rates: Remote.NotAsked,
  transactions: []
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_ETHEREUM_DATA_LOADING: {
      const newState = {
        addresses: Remote.Loading,
        info: Remote.Loading,
        latest_block: Remote.Loading
      }
      return merge(state, newState)
    }
    case AT.FETCH_ETHEREUM_DATA_SUCCESS: {
      const newState = {
        addresses: Remote.Success(prop('addresses', payload)),
        info: Remote.Success(prop('info', payload)),
        latest_block: Remote.Success(prop('latest_block', payload))
      }
      return merge(state, newState)
    }
    case AT.FETCH_ETHEREUM_DATA_FAILURE: {
      const newState = {
        addresses: Remote.Failure(prop('addresses', payload)),
        info: Remote.Failure(prop('info', payload)),
        latest_block: Remote.Failure(prop('latest_block', payload))
      }
      return merge(state, newState)
    }
    case AT.FETCH_ETHEREUM_FEE_LOADING: {
      return assoc('fee', Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_FEE_SUCCESS: {
      return assoc('fee', Remote.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_FEE_FAILURE: {
      return assoc('fee', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_LOADING: {
      return assoc('latest_block', Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_SUCCESS: {
      return assoc('latest_block', Remote.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_FAILURE: {
      return assoc('latest_block', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_RATES_LOADING: {
      return assoc('rates', Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_RATES_SUCCESS: {
      return assoc('rates', Remote.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_RATES_FAILURE: {
      return assoc('rates', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTIONS_LOADING: {
      return over(lensProp('transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTIONS_SUCCESS: {
      return over(lensProp('transactions'), compose(append(Remote.Success(payload)), dropLast(1)), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTIONS_FAILURE: {
      return over(lensProp('transactions'), compose(append(Remote.Failure(payload)), dropLast(1)), state)
    }
    // case AT.FETCH_ETHEREUM_TRANSACTIONS: {
    //   const { address } = payload
    //   const path = ['transactions', address]
    //   const lens = lensPath(path)
    //   const data = view(lens, state)
    //   return isNil(data) ? assocPath(path, [], state) : state
    // }
    // case AT.FETCH_ETHEREUM_TRANSACTIONS_LOADING: {
    //   const { address } = payload
    //   const lens = lensPath(['transactions', address])
    //   return over(lens, append(Remote.Loading), state)
    // }
    // case AT.FETCH_ETHEREUM_TRANSACTIONS_SUCCESS: {
    //   const { address, transactions } = payload
    //   const lens = lensPath(['transactions', address])
    //   const data = map(x => Remote.Success(x), transactions)
    //   const newState = over(lens, compose(concat(data), dropLast(1)), state)
    //   console.log('newState', newState)
    //   return newState
    // }
    // case AT.FETCH_ETHEREUM_TRANSACTIONS_FAILURE: {
    //   const { address, error } = payload
    //   const lens = lensPath(['transactions', address])
    //   return over(lens, compose(concat(Remote.Failure(error)), dropLast(1)), state)
    // }

    default:
      return state
  }
}
