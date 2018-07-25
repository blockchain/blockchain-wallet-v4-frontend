import { Remote } from 'blockchain-wallet-v4/src'
import { assoc } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  personalStep: Remote.Loading,
  emailStep: Remote.Loading,
  smsStep: Remote.Loading,
  formBusy: false,
  supportedCountries: Remote.NotAsked,
  adresses: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_PERSONAL_STEP: {
      return assoc('personalStep', Remote.of(payload.step), state)
    }
    case AT.SET_EMAIL_STEP: {
      return assoc('emailStep', Remote.of(payload.step), state)
    }
    case AT.SET_SMS_STEP: {
      return assoc('smsStep', Remote.of(payload.step), state)
    }
    case AT.SET_FORM_BUSY: {
      return assoc('formBusy', payload.busy, state)
    }
    case AT.SET_SUPPORTED_COUNTRIES: {
      return assoc('supportedCountries', payload.countries, state)
    }
    case AT.SET_ADDRESSES: {
      return assoc('adresses', payload.addresses, state)
    }
    default:
      return state
  }
}
