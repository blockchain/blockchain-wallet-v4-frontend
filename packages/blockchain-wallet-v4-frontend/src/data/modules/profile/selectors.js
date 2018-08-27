import { and, path, compose, converge, lift, prop, contains } from 'ramda'
import { selectors } from 'data'
import { eeaCountryCodes } from 'services/IdentityVerificationService'
import { Remote } from 'blockchain-wallet-v4'

export const getUserData = path(['profile', 'userData'])
export const getUserActivationState = compose(
  prop('state'),
  getUserData
)
export const getUserKYCState = compose(
  prop('kycState'),
  getUserData
)

export const isCountrySupported = countryCode =>
  contains(countryCode, eeaCountryCodes)

export const invitedToKyc = state =>
  selectors.core.settings.getInvitations(state).map(prop('kyc'))
export const countrySupportsKyc = () => Remote.of(true)
// compose(
//   isCountrySupported,
//   selectors.core.settings.getCountryCode
// )
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
