import { assocPath } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  currencies: {}
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_LIMITS_LOADING:
      return assocPath(['currencies', payload.currency], Remote.Loading, state)
    case AT.FETCH_LIMITS_SUCCESS:
      return assocPath(
        ['currencies', payload.currency],
        Remote.Success(payload.limits),
        state
      )
    case AT.FETCH_LIMITS_ERROR:
      return assocPath(
        ['currencies', payload.currency],
        Remote.Failure(payload.error),
        state
      )
    default:
      return state
  }
}
