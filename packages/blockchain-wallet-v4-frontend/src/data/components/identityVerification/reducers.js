import { Remote } from 'blockchain-wallet-v4/src'
import { assoc } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  addressRefetchVisible: false,
  smsStep: Remote.Loading,
  supportedCountries: Remote.NotAsked,
  possibleAdresses: []
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_SMS_STEP: {
      return assoc('smsStep', Remote.of(payload.step), state)
    }
    case AT.SET_SUPPORTED_COUNTRIES: {
      return assoc('supportedCountries', payload.countries, state)
    }
    case AT.SET_ADDRESS_REFETCH_VISIBLE: {
      return assoc('addressRefetchVisible', payload.isVisible, state)
    }
    case AT.SET_POSSIBLE_ADDRESSES: {
      return assoc('possibleAddresses', payload.addresses, state)
    }
    default:
      return state
  }
}
