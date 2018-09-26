import {
  and,
  path,
  compose,
  converge,
  equals,
  lift,
  prop,
  contains
} from 'ramda'
import { selectors } from 'data'
import { eeaCountryCodes } from 'services/IdentityVerificationService'
import { Remote } from 'blockchain-wallet-v4'
import { USER_ACTIVATION_STATES, KYC_STATES } from './model'

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

export const isCountrySupported = countryCode =>
  contains(countryCode, eeaCountryCodes)

export const invitedToKyc = state =>
  selectors.core.settings.getInvitations(state).map(prop('kyc'))
export const countrySupportsKyc = state => Remote.of(true)
// Remote.of(selectors.core.settings.getCountryCode(state)).map(
//   isCountrySupported
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
