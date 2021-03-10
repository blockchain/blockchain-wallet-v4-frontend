import { assoc, dissoc } from 'ramda'

import * as AT from './actionTypes'

const INITIAL_STATE = {}

const settings = (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.ADD_MNEMONIC: {
      return assoc('recovery_phrase', payload.phrase.mnemonic, state)
    }
    case AT.REMOVE_RECOVERY_PHRASE: {
      return dissoc('recovery_phrase', state)
    }
    case AT.ADD_SHOWN_BTC_PRIV_KEY: {
      return assoc('shownBtcPrivKey', payload.priv, state)
    }
    case AT.ADD_SHOWN_ETH_PRIV_KEY: {
      return assoc('shownEthPrivKey', payload.priv, state)
    }
    case AT.ADD_SHOWN_ETH_LEGACY_PRIV_KEY: {
      return assoc('shownEthLegacyPrivKey', payload.priv, state)
    }
    case AT.ADD_SHOWN_XLM_PRIV_KEY: {
      return assoc('shownXlmPrivKey', payload.priv, state)
    }
    case AT.CLEAR_SHOWN_BTC_PRIV_KEY: {
      return dissoc('shownBtcPrivKey', state)
    }
    case AT.CLEAR_SHOWN_ETH_PRIV_KEY: {
      return dissoc('shownEthPrivKey', state)
    }
    case AT.CLEAR_SHOWN_ETH_LEGACY_PRIV_KEY: {
      return dissoc('shownEthLegacyPrivKey', state)
    }
    case AT.CLEAR_SHOWN_XLM_PRIV_KEY: {
      return dissoc('shownXlmPrivKey', state)
    }
    case AT.VERIFY_EMAIL_CODE_FAILURE: {
      return assoc('emailVerifiedError', true, state)
    }
    case AT.CLEAR_EMAIL_CODE_FAILURE: {
      return assoc('emailVerifiedError', false, state)
    }
    case AT.VERIFY_MOBILE_FAILURE: {
      return assoc('mobileVerifiedError', true, state)
    }
    case AT.CLEAR_MOBILE_FAILURE: {
      return assoc('mobileVerifiedError', false, state)
    }
    default: {
      return state
    }
  }
}

export default settings
