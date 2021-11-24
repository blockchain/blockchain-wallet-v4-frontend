import { path, prop } from 'ramda'

import { Remote } from '@core'
import { /* AccountTokensBalancesResponseType, */ RemoteDataType } from '@core/types'
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
export const getAppEnv = (state) => getWebOptions(state).map(path(['application', 'environment']))
export const getAnnouncements = (state) =>
  getWebOptions(state).map(path(['application', 'announcements']))
export const getNewCoinListing = (state: RootState) =>
  getOptions(state).map((options) => options.platforms.web.coinListing)
export const getCoinRename = (state: RootState) =>
  getOptions(state).map((options) => options.platforms.web.coinRename)

export const getXlmSendTimeOutSeconds = () => Remote.of(600)
export const getXlmExchangeAddresses = () => Remote.of([])

// 3rd Party
export const getVeriffDomain = (state) => getDomains(state).map(prop('veriff'))
export const getSiftKey = (state) => getWebOptions(state).map(path(['sift', 'apiKey']))

//
// FEATURE FLAG SELECTORS
//

// all flags
export const getFeatureFlags = (
  state: RootState
): RemoteDataType<string, { [key in string]: boolean }> =>
  getWebOptions(state).map(path(['featureFlags'])) as RemoteDataType<
    string,
    { [key in string]: boolean }
  >

// show pairing code flag on staging
export const getPairingCodeFlag = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'developerMobilePairing']))

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

// on hold funds feature flag
export const getWithdrawalLocksFundsOnHold = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'withdrawalLocksFundsOnHold']))

// signup country feature flag
export const getEDDInterestFileUpload = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'eddInterestFileUpload']))

// celoEUR sweepstake feature flag
export const getCeloEurRewards = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'cEURRewards']))

export const getPollForMagicLinkData = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'pollForMagicLinkData']))

// send the card to new payment processors feature flag
export const getPaymentProcessors = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'paymentProcessors']))
