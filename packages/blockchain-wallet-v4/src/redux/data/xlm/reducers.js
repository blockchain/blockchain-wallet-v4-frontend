import {
  assoc,
  merge,
  lensProp,
  over,
  append,
  compose,
  dropLast,
  prop
} from 'ramda'
import * as AT from './actionTypes'
import Remote from '../../../remote'

const INITIAL_STATE = {
  addresses: Remote.NotAsked,
  latest_block: Remote.NotAsked,
  balance: Remote.NotAsked,
  rates: Remote.NotAsked,
  info: Remote.NotAsked,
  transactions: []
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_XLM_DATA_LOADING: {
      const newState = {
        addresses: Remote.Loading,
        info: Remote.Loading,
        latest_block: Remote.Loading
      }
      return merge(state, newState)
    }
    case AT.FETCH_XLM_DATA_SUCCESS: {
      const newState = {
        addresses: Remote.Success(prop('addresses', payload)),
        info: Remote.Success(prop('info', payload)),
        latest_block: Remote.Success(prop('latest_block', payload))
      }
      return merge(state, newState)
    }
    case AT.FETCH_XLM_DATA_FAILURE: {
      const newState = {
        addresses: Remote.Failure(prop('addresses', payload)),
        info: Remote.Failure(prop('info', payload)),
        latest_block: Remote.Failure(prop('latest_block', payload))
      }
      return merge(state, newState)
    }
    case AT.FETCH_XLM_BALANCE_LOADING: {
      return assoc('balance', Remote.Loading, state)
    }
    case AT.FETCH_XLM_BALANCE_SUCCESS: {
      const { balance } = payload
      return assoc('balance', Remote.Success(balance), state)
    }
    case AT.FETCH_XLM_BALANCE_FAILURE: {
      return assoc('balance', Remote.Failure(payload), state)
    }
    case AT.FETCH_XLM_RATES_LOADING: {
      return assoc('rates', Remote.Loading, state)
    }
    case AT.FETCH_XLM_RATES_SUCCESS: {
      return assoc('rates', Remote.Success(payload), state)
    }
    case AT.FETCH_XLM_RATES_FAILURE: {
      return assoc('rates', Remote.Failure(payload), state)
    }
    case AT.FETCH_XLM_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assoc('transactions', [Remote.Loading], state)
        : over(lensProp('transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_XLM_TRANSACTIONS_SUCCESS: {
      const { transactions, reset } = payload
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
    case AT.FETCH_XLM_TRANSACTIONS_FAILURE: {
      return assoc('transactions', [Remote.Failure(payload)], state)
    }
    default:
      return state
  }
}
