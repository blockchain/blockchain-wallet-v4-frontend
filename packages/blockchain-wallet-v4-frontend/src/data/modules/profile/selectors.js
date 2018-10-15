import {
  and,
  any,
  path,
  compose,
  converge,
  equals,
  lift,
  prop,
  propEq
} from 'ramda'
import { selectors } from 'data'
import { USER_ACTIVATION_STATES, KYC_STATES } from './model'
import { Remote } from 'blockchain-wallet-v4/src'

export const getUserData = path(['profile', 'userData'])
export const getUserActivationState = compose(
  prop('state'),
  getUserData
)
export const getUserKYCState = compose(
  prop('kycState'),
  getUserData
)
export const isUserActive = compose(
  equals(USER_ACTIVATION_STATES.ACTIVE),
  getUserActivationState
)
export const isUserVerified = compose(
  equals(KYC_STATES.VERIFIED),
  getUserKYCState
)
export const getUserCountryCode = compose(
  path(['address', 'country']),
  getUserData
)

export const isCountrySupported = (countryCode, supportedCountries) =>
  any(propEq('code', countryCode), supportedCountries)
export const invitedToKyc = state =>
  selectors.core.settings.getInvitations(state).map(prop('kyc'))
export const countrySupportsKyc = state =>
  converge(lift(isCountrySupported), [
    selectors.core.settings.getCountryCode,
    selectors.components.identityVerification.getSupportedCountries
  ])(state)
export const userFlowSupported = converge(lift(and), [
  invitedToKyc,
  () => Remote.of(true)
])

export const getApiToken = path(['profile', 'apiToken'])

export const isAuthenticated = state => getApiToken(state).map(prop('isActive'))

export const getAuthCredentials = state => ({
  token: getApiToken(state).getOrElse(''),
  email: selectors.core.settings.getEmail(state).getOrElse(''),
  guid: selectors.core.wallet.getGuid(state)
})
