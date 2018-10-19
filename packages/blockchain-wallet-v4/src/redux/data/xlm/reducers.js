import { assoc, lensProp, over, append, compose, dropLast } from 'ramda'
import * as AT from './actionTypes'
import Remote from '../../../remote'

const INITIAL_STATE = {
  ledgerDetails: Remote.NotAsked,
  data: Remote.NotAsked,
  rates: Remote.NotAsked,
  transactions: [],
  transactionsAtBound: false
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_LEDGER_DETAILS: {
      return assoc('ledgerDetails', payload.ledger, state)
    }
    case AT.FETCH_DATA_SUCCESS: {
      return assoc('data', Remote.Success(payload.data), state)
    }
    case AT.FETCH_DATA_FAILURE: {
      return assoc('data', Remote.Failure(payload.error), state)
    }
    case AT.FETCH_DATA_LOADING: {
      return assoc('data', Remote.Loading, state)
    }
    case AT.SET_RATES: {
      return assoc('rates', payload.rates, state)
    }
    case AT.FETCH_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assoc('transactions', [Remote.Loading], state)
        : over(lensProp('transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_TRANSACTIONS_SUCCESS: {
      const { txs, reset } = payload
      return reset
        ? assoc('transactions', [Remote.Success(txs)], state)
        : over(
            lensProp('transactions'),
            compose(
              append(Remote.Success(txs)),
              dropLast(1)
            ),
            state
          )
    }
    case AT.FETCH_TRANSACTIONS_FAILURE: {
      return assoc('transactions', [Remote.Failure(payload)], state)
    }
    case AT.TRANSACTIONS_AT_BOUND: {
      return assoc('transactionsAtBound', payload.atBound, state)
    }
    default:
      return state
  }
}
