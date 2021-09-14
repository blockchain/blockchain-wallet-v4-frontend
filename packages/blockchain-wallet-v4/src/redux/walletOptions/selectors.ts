import { path, prop } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { /* AccountTokensBalancesResponseType, */ RemoteDataType } from 'core/types'
// eslint-disable-next-line import/no-extraneous-dependencies
import { RootState } from 'data/rootReducer'

import { WalletOptionsType } from './types'

// general
export const getOptions = (state: RootState) =>
  state.walletOptionsPath as RemoteDataType<string, WalletOptionsType>
export const getDomains = (state) => getOptions(state).map((x) => x.domains)
export const getWebOptions = (state) =>
  getOptions(state).map(path(['platforms', 'web'])) as RemoteDataType<
    string,
    WalletOptionsType['platforms']['web']
  >
export const getWalletHelperUrl = (state) => getDomains(state).map(prop('walletHelper'))
export const getAppEnv = (state) => getWebOptions(state).map(path(['application', 'environment']))
export const getAnalyticsSiteId = (state) =>
  getWebOptions(state).map(path(['application', 'analyticsSiteId']))
export const getAnnouncements = (state) =>
  getWebOptions(state).map(path(['application', 'announcements']))
export const getNewCoinListing = (state: RootState) =>
  getOptions(state).map((options) => options.platforms.web.coinListing)

export const getXlmSendTimeOutSeconds = () => Remote.of(600)
export const getXlmExchangeAddresses = () => Remote.of([])

// 3rd Party
export const getVeriffDomain = (state) => getDomains(state).map(prop('veriff'))
export const getSiftKey = (state) => getWebOptions(state).map(path(['sift', 'apiKey']))

//
// FEATURE FLAG SELECTORS
//

// show pairing code flag on staging
export const getPairingCodeFlag = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'legacyMobilePairing']))

// recurring buys flag
export const getFeatureFlagRecurringBuys = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'recurringBuys']))

// legacy recovery flag
export const getFeatureLegacyWalletRecovery = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'legacyWalletRecovery']))

// legacy magic email link
export const getFeatureLegacyMagicEmailLink = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'legacyMagicEmailLink']))

// signup country feature flag
export const getFeatureSignupCountry = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'signupCountry']))

// signup country feature flag
export const getEDDInterestFileUpload = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'eddInterestFileUpload']))

export const getSsoDummy = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'ssoDummy']))
