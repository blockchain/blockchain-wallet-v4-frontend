import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = []

const sfoxSignup = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.NEXT_STEP:
      return assoc('signupStep', payload, state)
    default:
      return state
  }
}

export default sfoxSignup
