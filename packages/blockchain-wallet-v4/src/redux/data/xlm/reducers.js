import { append, assoc, assocPath, compose, dropLast, lensProp, over, prepend } from 'ramda'

import Remote from '../../../remote'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  data: {},
  ledgerDetails: Remote.NotAsked,
  transaction_history: Remote.NotAsked,
  transactions: [],
  transactions_at_bound: false
}

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.SET_LEDGER_DETAILS_LOADING: {
      return assoc('ledgerDetails', Remote.Loading, state)
    }
    case AT.SET_LEDGER_DETAILS_SUCCESS: {
      return assoc('ledgerDetails', Remote.Success(payload.ledger), state)
    }
    case AT.SET_LEDGER_DETAILS_FAILURE: {
      return assoc('ledgerDetails', Remote.Failure(payload.e), state)
    }
    case AT.FETCH_ACCOUNT_SUCCESS: {
      return assocPath(['data', payload.id], Remote.Success(payload.account), state)
    }
    case AT.FETCH_ACCOUNT_FAILURE: {
      return assocPath(['data', payload.id], Remote.Failure(payload.error), state)
    }
    case AT.FETCH_ACCOUNT_LOADING: {
      return assocPath(['data', payload.id], Remote.Loading, state)
    }
    case AT.FETCH_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assoc('transactions', [Remote.Loading], state)
        : over(lensProp('transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_TRANSACTIONS_SUCCESS: {
      const { reset, txs } = payload
      return reset
        ? assoc('transactions', [Remote.Success(txs)], state)
        : over(lensProp('transactions'), compose(append(Remote.Success(txs)), dropLast(1)), state)
    }
    case AT.FETCH_TRANSACTIONS_FAILURE: {
      return assoc('transactions', [Remote.Failure(payload)], state)
    }
    case AT.ADD_NEW_TRANSACTIONS: {
      const { txs } = payload
      return over(lensProp('transactions'), prepend(Remote.Success(txs)), state)
    }
    case AT.TRANSACTIONS_AT_BOUND: {
      return assoc('transactions_at_bound', payload.atBound, state)
    }
    case AT.FETCH_TRANSACTION_HISTORY_LOADING: {
      return assoc('transaction_history', Remote.Loading, state)
    }
    case AT.FETCH_TRANSACTION_HISTORY_SUCCESS: {
      return assoc('transaction_history', Remote.Success(payload), state)
    }
    case AT.FETCH_TRANSACTION_HISTORY_FAILURE: {
      return assoc('transaction_history', Remote.Failure(payload), state)
    }
    case AT.CLEAR_TRANSACTION_HISTORY: {
      return assoc('transaction_history', Remote.NotAsked, state)
    }
    default:
      return state
  }
}
