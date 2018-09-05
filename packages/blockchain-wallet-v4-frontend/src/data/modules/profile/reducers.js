import { merge, assoc } from 'ramda'
import * as AT from './actionTypes'
import { KYC_STATES, USER_ACTIVATION_STATES } from './model'

import { Remote } from 'blockchain-wallet-v4'

const INITIAL_STATE = {
  userData: {
    state: USER_ACTIVATION_STATES.NOT_CREATED,
    kycState: KYC_STATES.NONE
  },
  apiToken: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_USER_DATA:
      return assoc('userData', merge(state.userData, payload.userData), state)
    case AT.SET_API_TOKEN:
      return assoc('apiToken', payload.token, state)
    default:
      return state
  }
}
