import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = []

const settings = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.ADD_MNEMONIC:
      return assoc('recovery_phrase', payload.phrase.mnemonic, state)
    default:
      return state
  }
}

export default settings
