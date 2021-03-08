import { lensPath, set } from 'ramda'

import * as AT from './actionTypes'

const INITIAL_STATE = {}

const wizard = (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.SET_STEP: {
      const { name, step } = payload
      return set(lensPath([name, 'step']), step, state)
    }
    case AT.RESET_STEP: {
      const { name } = payload
      return set(lensPath([name, 'step']), 1, state)
    }
    default:
      return state
  }
}

export default wizard
