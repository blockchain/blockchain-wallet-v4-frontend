import { path, compose, prop } from 'ramda'
// import { path, compose, prop, contains } from 'ramda'
import { selectors } from 'data'
// import { eeaCountryCodes } from 'services/IdentityVerificationService'
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

// const isCountrySupported = countryCode => contains(countryCode, eeaCountryCodes)

export const userFlowSupported = state => Remote.of(false)
// selectors.core.settings.getCountryCode(state).map(isCountrySupported)

export const getApiToken = path(['profile', 'apiToken'])

export const isAuthenticated = state => getApiToken(state).map(prop('isActive'))

export const getAuthCredentials = state => ({
  token: getApiToken(state).getOrElse(''),
  email: selectors.core.settings.getEmail(state).getOrElse(''),
  guid: selectors.core.wallet.getGuid(state)
})
