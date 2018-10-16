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
    case AT.SET_DATA: {
      return assoc('data', payload.data, state)
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
