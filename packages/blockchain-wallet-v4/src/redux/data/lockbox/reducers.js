import { assoc, lensProp, over, append, compose, dropLast } from 'ramda'
import * as AT from './actionTypes'
import Remote from '../../../remote'

const INITIAL_STATE = {
  btc_transactions: []
}

const lockboxReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_BTC_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assoc('btc_transactions', [Remote.Loading], state)
        : over(lensProp('btc_transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_BTC_TRANSACTIONS_SUCCESS: {
      const { reset, transactions } = payload
      return reset
        ? assoc('btc_transactions', [Remote.Success(transactions)], state)
        : over(
            lensProp('btc_transactions'),
            compose(
              append(Remote.Success(transactions)),
              dropLast(1)
            ),
            state
          )
    }
    case AT.FETCH_BTC_TRANSACTIONS_FAILURE: {
      return assoc('btc_transactions', [Remote.Failure(payload)], state)
    }
    default:
      return state
  }
}

export default lockboxReducer
