import { path, prop } from 'ramda'

import { Remote } from '@core'
import { /* AccountTokensBalancesResponseType, */ Product, RemoteDataType } from '@core/types'
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

// legacy magic email link
export const getFeatureLegacyMagicEmailLink = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'legacyMagicEmailLink']))

// signup country feature flag
export const getFeatureSignupCountry = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'signupCountry']))

// redesign feature flag
export const getRedesignEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'isRedesignEnabled']))

// on hold funds feature flag
export const getWithdrawalLocksFundsOnHold = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'withdrawalLocksFundsOnHold']))

// signup country feature flag
export const getEDDInterestFileUpload = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'eddInterestFileUpload']))

// celoEUR sweepstake feature flag
export const getCeloEurRewards = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'cEURRewards']))

// merge and upgrade wallet + exchange accounts
export const getMergeAndUpgradeAccounts = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'mergeAndUpgrade']))

// apple pay as new payment method feature flag
export const getApplePayAsNewPaymentMethod = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'applePayPaymentMethod']))

// send the card to new payment processors feature flag (checkout)
export const getAddCheckoutDotComPaymentProvider = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'addCheckoutPaymentProvider']))

// send the card to new payment processors feature flag (stripe)
export const getAddStripePaymentProvider = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'addStripePaymentProvider']))

// use card from new payment providers (stripe and checkout)
export const getUseNewPaymentProviders = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'useNewPaymentProviders']))

export const getFlexiblePricingModel = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'flexiblePricingModel']))

// show/hide wallet connect
export const getWalletConnectEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'walletConnect']))

export const getHotWalletAddresses = (state: RootState, product: Product) =>
  getWebOptions(state).map(path(['hotWalletAddresses', product, 'eth']))

// show/hide complete your profile flyout
export const getCompleteYourProfile = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'completeYourProfile']))

// show/hide trading currency flyout
export const getTradingCurrency = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'tradingCurrencyFlyout']))

// show/hide wallet debit card
export const getWalletDebitCardEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'walletDebitCardEnabled']))

// show/hide wallet tax center
export const getTaxCenterEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'taxCenter']))

// refresh captcha token if there's an error on signup
export const getRefreshCaptchaOnSignupError = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'refreshCaptchaWithSignupError']))

// use new institutional portal app
export const getInstitutionalPortalEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'institutionalPortal']))

// show/hide silver revamp
export const getSilverRevamp = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'silverRevamp']))

// show terms and conditions
export const getShowTermsAndConditions = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'showTermsAndConditions']))
