import { path, compose, prop, contains } from 'ramda'
import { selectors } from 'data'
import { eeaCountryCodes } from 'services/IdentityVerificationService'

export const getUserData = path(['profile', 'userData'])
export const getUserActivationState = compose(
  prop('state'),
  getUserData
)
export const getUserKYCState = compose(
  prop('kycState'),
  getUserData
)

const isCountrySupported = countryCode => contains(countryCode, eeaCountryCodes)

export const userFlowSupported = state =>
  selectors.core.settings.getCountryCode(state).map(isCountrySupported)

export const getApiToken = path(['profile', 'apiToken'])

export const isAuthenticated = state => getApiToken(state).map(prop('isActive'))
