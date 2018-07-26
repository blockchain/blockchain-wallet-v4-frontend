import { merge, assoc } from 'ramda'
import * as AT from './actionTypes'
import { KYC_STATES, USER_ACTIVATION_STATES } from './model'

const INITIAL_STATE = {
  userData: {
    state: USER_ACTIVATION_STATES.NONE,
    kycState: KYC_STATES.NONE
  }
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_USER_DATA:
      return assoc('userData', merge(state.userData, payload.userData), state)
    default:
      return state
  }
}
