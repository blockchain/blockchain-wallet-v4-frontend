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
  rates: Remote.NotAsked,
  transactions: [],
  transactions_fiat: {},
  transactions_at_bound: false,
  unspendable_balance: Remote.NotAsked,
  transaction_history: Remote.NotAsked
}

const bitcoinReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_BITCOIN_LATEST_BLOCK: {
      return assocPath(['latest_block'], Remote.Success(payload), state)
    }
    case AT.FETCH_BITCOIN_DATA_LOADING: {
      const data = {
        addresses: Remote.Loading,
        info: Remote.Loading,
        latest_block: Remote.Loading
      }
      return merge(state, data)
    }
    case AT.FETCH_BITCOIN_DATA_SUCCESS: {
      /* eslint-disable */
      const { addresses, info, latest_block } = payload
      /* eslint-enable */
      const data = {
        addresses: Remote.Success(addresses),
        info: Remote.Success(info),
        latest_block: Remote.Success(latest_block)
      }
      return merge(state, data)
    }
    case AT.FETCH_BITCOIN_DATA_FAILURE: {
      const data = {
        addresses: Remote.Failure(payload),
        info: Remote.Failure(payload),
        latest_block: Remote.Failure(payload)
      }
      return merge(state, data)
    }
    case AT.FETCH_BITCOIN_FEE_LOADING: {
      return assoc('fee', Remote.Loading, state)
    }
    case AT.FETCH_BITCOIN_FEE_SUCCESS: {
      return assoc('fee', Remote.Success(payload), state)
    }
    case AT.FETCH_BITCOIN_FEE_FAILURE: {
      return assoc('fee', Remote.Failure(payload), state)
    }
    case AT.FETCH_BITCOIN_RATES_LOADING: {
      return assoc('rates', Remote.Loading, state)
    }
    case AT.FETCH_BITCOIN_RATES_SUCCESS: {
      return assoc('rates', Remote.Success(payload), state)
    }
    case AT.FETCH_BITCOIN_RATES_FAILURE: {
      return assoc('rates', Remote.Failure(payload), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assoc('transactions', [Remote.Loading], state)
        : over(lensProp('transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTIONS_SUCCESS: {
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
    case AT.FETCH_BITCOIN_TRANSACTIONS_FAILURE: {
      return assoc('transactions', [Remote.Failure(payload)], state)
    }
    case AT.BTC_TRANSACTIONS_AT_BOUND: {
      return assoc('transactions_at_bound', payload, state)
    }
    case AT.FETCH_BITCOIN_FIAT_AT_TIME_LOADING: {
      const { hash, currency } = payload
      return assocPath(
        ['transactions_fiat', hash, currency],
        Remote.Loading,
        state
      )
    }
    case AT.FETCH_BITCOIN_FIAT_AT_TIME_SUCCESS: {
      const { hash, currency, data } = payload
      return assocPath(
        ['transactions_fiat', hash, currency],
        Remote.Success(data),
        state
      )
    }
    case AT.FETCH_BITCOIN_FIAT_AT_TIME_FAILURE: {
      const { hash, currency, error } = payload
      return assocPath(
        ['transactions_fiat', hash, currency],
        Remote.Success(error),
        state
      )
    }
    case AT.FETCH_BITCOIN_TRANSACTION_HISTORY_LOADING: {
      return assoc('transaction_history', Remote.Loading, state)
    }
    case AT.FETCH_BITCOIN_TRANSACTION_HISTORY_SUCCESS: {
      return assoc('transaction_history', Remote.Success(payload), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTION_HISTORY_FAILURE: {
      return assoc('transaction_history', Remote.Failure(payload), state)
    }
    case AT.CLEAR_BITCOIN_TRANSACTION_HISTORY: {
      return assoc('transaction_history', Remote.NotAsked, state)
    }
    case AT.FETCH_BITCOIN_UNSPENDABLE_BALANCE_LOADING: {
      return state
    }
    case AT.FETCH_BITCOIN_UNSPENDABLE_BALANCE_SUCCESS: {
      return assoc('unspendable_balance', Remote.Success(payload), state)
    }
    case AT.FETCH_BITCOIN_UNSPENDABLE_BALANCE_FAILURE: {
      return assoc('unspendable_balance', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}

export default bitcoinReducer
