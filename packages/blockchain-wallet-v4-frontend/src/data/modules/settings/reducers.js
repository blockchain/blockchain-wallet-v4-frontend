import * as AT from './actionTypes'
import { assoc, dissoc } from 'ramda'

const INITIAL_STATE = {}

const settings = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.ADD_MNEMONIC: {
      return assoc('recovery_phrase', payload.phrase.mnemonic, state)
    }
    case AT.ADD_SHOWN_BTC_PRIV_KEY: {
      return assoc('shownBtcPrivKey', payload.priv, state)
    }
    case AT.ADD_SHOWN_ETH_PRIV_KEY: {
      return assoc('shownEthPrivKey', payload.priv, state)
    }
    case AT.CLEAR_SHOWN_BTC_PRIV_KEY: {
      return dissoc('shownBtcPrivKey', state)
    }
    case AT.CLEAR_SHOWN_ETH_PRIV_KEY: {
      return dissoc('shownEthPrivKey', state)
    }
    case AT.VERIFY_EMAIL_CODE_FAILURE: {
      return assoc('emailVerifiedError', true, state)
    }
    case AT.CLEAR_EMAIL_CODE_FAILURE: {
      return assoc('emailVerifiedError', state)
    }
    case AT.VERIFY_MOBILE_FAILURE: {
      return assoc('mobileVerifiedError', true, state)
    }
    case AT.CLEAR_MOBILE_FAILURE: {
      return assoc('mobileVerifiedError', state)
    }
    default: {
      return state
    }
  }
}

export default settings
