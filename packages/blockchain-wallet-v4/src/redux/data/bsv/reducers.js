import {
  assoc,
  assocPath,
  merge,
  lensProp,
  over,
  append,
  compose,
  dropLast
} from 'ramda'
import * as AT from './actionTypes'
import Remote from '../../../remote'

const INITIAL_STATE = {
  addresses: Remote.NotAsked,
  fee: Remote.NotAsked,
  info: Remote.NotAsked,
  latest_block: Remote.NotAsked,
  rates: Remote.of({}),
  transactions: [],
  transactions_at_bound: false
}

const bsvReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_BSV_LATEST_BLOCK: {
      return assocPath(['latest_block'], Remote.Success(payload), state)
    }
    case AT.FETCH_BSV_DATA_LOADING: {
      const data = {
        addresses: Remote.Loading,
        info: Remote.Loading,
        latest_block: Remote.Loading
      }
      return merge(state, data)
    }
    case AT.FETCH_BSV_DATA_SUCCESS: {
      const { addresses, info, latest_block } = payload
      const data = {
        addresses: Remote.Success(addresses),
        info: Remote.Success(info),
        latest_block: Remote.Success(latest_block)
      }
      return merge(state, data)
    }
    case AT.FETCH_BSV_DATA_FAILURE: {
      const { addresses, info, latest_block } = payload
      const data = {
        addresses: Remote.Failure(addresses),
        info: Remote.Failure(info),
        latest_block: Remote.Failure(latest_block)
      }
      return merge(state, data)
    }
    case AT.RESET_BSV_DATA: {
      return merge(state, INITIAL_STATE)
    }
    case AT.FETCH_BSV_FEE_LOADING: {
      return assoc('fee', Remote.Loading, state)
    }
    case AT.FETCH_BSV_FEE_SUCCESS: {
      return assoc('fee', Remote.Success(payload), state)
    }
    case AT.FETCH_BSV_FEE_FAILURE: {
      return assoc('fee', Remote.Failure(payload), state)
    }
    case AT.FETCH_BSV_RATES_LOADING: {
      return assoc('rates', Remote.Loading, state)
    }
    case AT.FETCH_BSV_RATES_SUCCESS: {
      return assoc('rates', Remote.Success(payload), state)
    }
    case AT.FETCH_BSV_RATES_FAILURE: {
      return assoc('rates', Remote.Failure(payload), state)
    }
    case AT.FETCH_BSV_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assoc('transactions', [Remote.Loading], state)
        : over(lensProp('transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_BSV_TRANSACTIONS_SUCCESS: {
      const { reset, transactions } = payload
      return reset
        ? assoc('transactions', [Remote.Success(transactions)], state)
        : over(
            lensProp('transactions'),
            compose(
              append(Remote.Success(transactions)),
              dropLast(1)
            ),
            state
          )
    }
    case AT.FETCH_BSV_TRANSACTIONS_FAILURE: {
      return assoc('transactions', [Remote.Failure(payload)], state)
    }
    case AT.BSV_TRANSACTIONS_AT_BOUND: {
      return assoc('transactions_at_bound', payload, state)
    }
    default:
      return state
  }
}

export default bsvReducer
