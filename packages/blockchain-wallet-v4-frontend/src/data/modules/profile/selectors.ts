import {
  any,
  complement,
  compose,
  curry,
  equals,
  find,
  findLast,
  hasPath,
  isNil,
  lift,
  lte,
  not,
  path,
  pathOr,
  prop,
  propEq
} from 'ramda'
import { KYC_STATES, TIERS_STATES, USER_ACTIVATION_STATES } from './model'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getUserData = (state: RootState) => state.profile.userData
export const getUserCampaigns = (state: RootState) =>
  state.profile.userCampaigns

export const getUserId = compose(
  lift(prop('id')),
  getUserData
)
export const getWalletAddresses = compose(
  lift(prop('walletAddresses')),
  getUserData
)
export const getUserActivationState = compose(
  lift(prop('state')),
  getUserData
)
export const getUserKYCState = compose(
  lift(prop('kycState')),
  getUserData
)
export const getTags = compose(
  lift(path(['tags'])),
  getUserData
)
export const getSunRiverTag = compose(
  lift(path(['tags', 'SUNRIVER'])),
  getUserData
)
export const getPowerPaxTag = compose(
  lift(hasPath(['tags', 'POWER_PAX'])),
  getUserData
)
export const getBlockstackTag = compose(
  lift(path(['tags', 'BLOCKSTACK'])),
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
export const isUserStateNone = compose(
  lift(equals(USER_ACTIVATION_STATES.NONE)),
  getUserActivationState
)
export const isUserVerified = compose(
  lift(equals(KYC_STATES.VERIFIED)),
  getUserKYCState
)
export const isSilverOrAbove = compose(
  lte(1),
  // @ts-ignore
  path(['data', 'current']),
  lift(path(['tiers'])),
  getUserData
)

export const getCurrentTier = compose(
  path(['data', 'current']),
  lift(path(['tiers'])),
  getUserData
)

export const getUserCountryCode = compose(
  lift(path(['address', 'country'])),
  getUserData
)
export const getUserStateCode = compose(
  lift(path(['address', 'state'])),
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
export const getKycDocResubmissionStatus = compose(
  lift(path(['resubmission', 'reason'])),
  getUserData
)

export const getTiers = path(['profile', 'userTiers'])
export const getTier = curry((state, tierIndex) =>
  lift(find(propEq('index', tierIndex)))(getTiers(state))
)
export const getLastAttemptedTier = compose(
  lift(findLast(complement(propEq('state', TIERS_STATES.NONE)))),
  getTiers
)

export const isCountrySupported = (countryCode, supportedCountries) =>
  any(propEq('code', countryCode), supportedCountries)
export const isInvitedToKyc = state =>
  selectors.core.settings.getInvitations(state).map(prop('kyc'))

export const userFlowSupported = isInvitedToKyc

export const getApiToken = path(['profile', 'apiToken'])

// @ts-ignore
export const isAuthenticated = state => getApiToken(state).map(prop('isActive'))

export const getAuthCredentials = state => ({
  // @ts-ignore
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

export const getLinkFromExchangeAccountStatus = path([
  'profile',
  'exchangeOnboarding',
  'linkFromExchangeAccountStatus'
])
export const getLinkToExchangeAccountStatus = path([
  'profile',
  'exchangeOnboarding',
  'linkToExchangeAccountStatus'
])
export const getLinkToExchangeAccountDeeplink = path([
  'profile',
  'exchangeOnboarding',
  'linkToExchangeAccountDeeplink'
])
export const getShareWalletAddressesStatus = (state: RootState) =>
  state.profile.exchangeOnboarding.shareWalletAddressesWithExchange
export const isExchangeAccountLinked = state =>
  lift(user => not(isNil(prop('settings', user))))(getUserData(state))
