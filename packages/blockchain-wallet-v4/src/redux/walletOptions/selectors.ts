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
export const getEDDInterestFileUpload = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'eddInterestFileUpload']))

// merge and upgrade wallet + exchange accounts
export const getMergeAndUpgradeAccounts = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'mergeAndUpgrade']))
// login for unified accounts
export const getUnifiedAccountLogin = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'unifiedAccountLogin']))

// apple pay as new payment method feature flag
export const getApplePayAsNewPaymentMethod = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'applePayPaymentMethod']))

// google pay as new payment method feature flag
export const getGooglePayAsNewPaymentMethod = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'googlePayPaymentMethod']))

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

export const getHotWalletAddresses = (state: RootState, product: Product) =>
  getWebOptions(state).map(path(['hotWalletAddresses', product, 'eth']))

// show/hide complete your profile flyout
export const getCompleteYourProfile = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'completeYourProfile']))

// show/hide wallet debit card
export const getWalletDebitCardEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'walletDebitCardEnabled']))

// use new institutional portal app
export const getInstitutionalPortalEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'institutionalPortal']))

// show terms and conditions
export const getShowTermsAndConditions = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'showTermsAndConditions']))

export const getCoinViewV2 = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'coinViewV2']))

// SSO creating exchange users under the hood
// for all wallet logins and signup
export const getCreateExchangeUserOnSignupOrLogin = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'createExchangeUserOnSignupOrLogin']))

export const getNftExplorer = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'nftExplorer']))

// enable/disable BIND integration (AR)
export const getBindIntegrationArEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'bindIntegrationArEnabled']))

// show referral signup input in sign up
export const getReferralEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'isReferralEnabled']))

// show login button redirect for exchange mobile
// will take user out of webview into native signin
export const getExchangeMobileDuplicateAccountRedirect = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'exchangeMobileDuplicateAccountRedirect']))
