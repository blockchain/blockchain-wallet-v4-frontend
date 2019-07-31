import { assocPath } from 'ramda'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  pitPaymentsAccount: {
    BTC: Remote.NotAsked,
    BCH: Remote.NotAsked,
    ETH: Remote.NotAsked,
    PAX: Remote.NotAsked,
    XLM: Remote.NotAsked
  }
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_PAYMENTS_ACCOUNT_PIT_SUCCESS: {
      const { currency, data } = payload
      return assocPath(
        ['pitPaymentsAccount', currency],
        Remote.Success(data),
        state
      )
    }
    case AT.FETCH_PAYMENTS_ACCOUNT_PIT_LOADING: {
      const { currency } = payload
      return assocPath(['pitPaymentsAccount', currency], Remote.Loading, state)
    }
    case AT.FETCH_PAYMENTS_ACCOUNT_PIT_FAILURE: {
      const { currency, e } = payload
      return assocPath(
        ['pitPaymentsAccount', currency],
        Remote.Failure(e),
        state
      )
    }
    default:
      return state
  }
}
