import { assoc } from 'ramda'
import * as AT from './actionTypes'
import Remote from '../../../remote'

const INITIAL_STATE = {
  ledgerDetails: Remote.NotAsked,
  data: Remote.NotAsked,
  rates: Remote.NotAsked
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
    case AT.SET_XLM_RATES: {
      return assoc('rates', payload.rates, state)
    }
    default:
      return state
  }
}
