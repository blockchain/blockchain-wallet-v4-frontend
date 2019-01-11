import {
  any,
  compose,
  complement,
  curry,
  equals,
  find,
  findLast,
  lift,
  path,
  pathOr,
  prop,
  propEq
} from 'ramda'
import { selectors } from 'data'
import { USER_ACTIVATION_STATES, KYC_STATES, TIERS_STATES } from './model'

export const getUserData = path(['profile', 'userData'])
export const getUserActivationState = compose(
  lift(prop('state')),
  getUserData
)
export const getUserKYCState = compose(
  lift(prop('kycState')),
  getUserData
)
export const isUserCreated = compose(
  lift(equals(USER_ACTIVATION_STATES.CREATED)),
  getUserActivationState
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
export const getUserTiers = compose(
  lift(prop('tiers')),
  getUserData
)
export const getUserLimits = compose(
  lift(prop('limits')),
  getUserData
)

export const getTiers = path(['profile', 'userTiers'])
export const getTier = curry((tierIndex, state) =>
  lift(find(propEq('index', tierIndex)))(getTiers(state))
)
export const getLastAttemptedTier = compose(
  lift(findLast(complement(propEq('state', TIERS_STATES.NONE)))),
  getTiers
)

export const isCountrySupported = (countryCode, supportedCountries) =>
  any(propEq('code', countryCode), supportedCountries)
export const invitedToKyc = state =>
  selectors.core.settings.getInvitations(state).map(prop('kyc'))
export const userFlowSupported = invitedToKyc

export const getApiToken = path(['profile', 'apiToken'])

export const isAuthenticated = state => getApiToken(state).map(prop('isActive'))

export const getAuthCredentials = state => ({
  token: getApiToken(state).getOrElse(''),
  email: selectors.core.settings.getEmail(state).getOrElse(''),
  guid: selectors.core.wallet.getGuid(state)
})

export const getCampaign = pathOr(null, ['profile', 'campaign'])

export const CLOSE_TO_AMOUNT = 0.8
export const closeToTier1Limit = state =>
  lift(
    (userData, tiers) =>
      path([0, 'state'], tiers) === TIERS_STATES.VERIFIED &&
      path([1, 'state'], tiers) === TIERS_STATES.NONE &&
      pathOr(0, [0, 'limits', 'annual'], tiers)[0].limits.annual *
        CLOSE_TO_AMOUNT <
        pathOr(0, ['limits', 'annual'], userData)
  )(getUserData(state), getTiers(state))
