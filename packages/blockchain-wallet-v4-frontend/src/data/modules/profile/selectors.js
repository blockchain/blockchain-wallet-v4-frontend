import {
  and,
  any,
  path,
  pathOr,
  compose,
  converge,
  equals,
  lift,
  prop,
  propEq
} from 'ramda'
import { selectors } from 'data'
import { USER_ACTIVATION_STATES, TIERS, KYC_STATES } from './model'

export const getUserData = path(['profile', 'userData'])
export const getUserActivationState = compose(
  lift(prop('state')),
  getUserData
)
export const getUserKYCState = compose(
  lift(prop('kycState')),
  getUserData
)
export const isUserActive = compose(
  lift(equals(USER_ACTIVATION_STATES.ACTIVE)),
  getUserActivationState
)
export const isUserVerified = compose(
  lift(equals(KYC_STATES.VERIFIED)),
  getUserKYCState
)
export const getUserCountryCode = compose(
  lift(path(['address', 'country'])),
  getUserData
)

// TODO: remove when BE ships the TIER field
export const defineUserTier = (userState, kycState) => {
  if (userState !== USER_ACTIVATION_STATES.CREATED) return TIERS[0]
  if (kycState !== KYC_STATES.VERIFIED) return TIERS[1]
  return TIERS[2]
}
export const getUserTier = state =>
  lift(defineUserTier)(getUserActivationState(state), getUserKYCState(state))

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
  countrySupportsKyc
])

export const getApiToken = path(['profile', 'apiToken'])

export const isAuthenticated = state => getApiToken(state).map(prop('isActive'))

export const getAuthCredentials = state => ({
  token: getApiToken(state).getOrElse(''),
  email: selectors.core.settings.getEmail(state).getOrElse(''),
  guid: selectors.core.wallet.getGuid(state)
})

export const getCampaign = pathOr(null, ['profile', 'campaign'])
