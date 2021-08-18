import { path, prop } from 'ramda'

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

// eslint-disable-next-line
export const getXlmSendTimeOutSeconds = (state) => 600
// eslint-disable-next-line
export const getXlmExchangeAddresses = (state) => []

// domains
export const getVeriffDomain = (state) => getDomains(state).map(prop('veriff'))

// partners
export const getSiftKey = (state) => getWebOptions(state).map(path(['sift', 'apiKey']))
export const getSiftPaymentKey = (state: RootState) => {
  return getWebOptions(state).map((options) => options.sift.paymentKey)
}
// show pairing code flag on staging
export const getPairingCodeFlag = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'legacyMobilePairing']))

// mobile auth flag
export const getMobileAuthFlag = (state) =>
  getWebOptions(state).map(path(['mobile_auth', 'enabled']))

// brokerage deposits withdrawals flag
export const getBrokerageDepositsWithdrawals = (state) =>
  getWebOptions(state).map(path(['brokerage_deposits_withdrawals', 'enabled']))

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
