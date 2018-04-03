import * as AT from './actionTypes'
import { assoc, dissoc } from 'ramda'

const INITIAL_STATE = {}

const settings = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.ADD_MNEMONIC:
      return assoc('recovery_phrase', payload.phrase.mnemonic, state)
    case AT.ADD_SHOWN_PRIV_KEY:
      return assoc('shownPrivKey', payload.priv, state)
    case AT.CLEAR_SHOWN_PRIV_KEY:
      return dissoc('shownPrivKey', state)
    case AT.VERIFY_EMAIL_CODE_FAILURE: {
      return assoc('emailVerifiedError', true, state)
    }
    case AT.CLEAR_EMAIL_CODE_FAILURE: {
      return assoc('emailVerifiedError', state)
    }
    default:
      return state
  }
}

export default settings
