import { path, prop } from 'ramda'

import { Remote } from '@core'
import { Product, RemoteDataType } from '@core/types'
import { RootState } from 'data/rootReducer'

import { WalletOptionsType } from './types'

// general
export const getOptions = (state: RootState) => state.walletOptions.details
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
export const getWalletHelperDomain = (state) => getDomains(state).map(prop('walletHelper'))

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

export const getFeatureFlagUseVgsProvider = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'useVgsProvider']))

export const getFeatureFlagAvailableToTradeWithdraw = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'availableToTradeWithdraw']))

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
export const getAddPlaidPaymentProvider = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'addPlaidPaymentProvider']))

// send the card to new payment processors feature flag (checkout)
export const getAddCheckoutDotComPaymentProvider = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'addCheckoutPaymentProvider']))

// send the card to new payment processors feature flag (stripe)
export const getAddStripePaymentProvider = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'addStripePaymentProvider']))

// use card from new payment providers (stripe and checkout)
export const getUseNewPaymentProviders = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'useNewPaymentProviders']))

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

// check for rewards flow under swap Feature Flag
export const getRewardsFlowUnderSwapEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'rewardsFlowUnderSwapEnabled']))

// check for rewards promo banner to be enabled
export const getRewardsPromoBannerEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'rewardsPromoBanner']))

// check for rewards promo banner to be enabled
export const getAppleAndGooglePayPromoBannerEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'appleAndGooglePayPromoBanner']))

// show referral signup input in sign up
export const getReferralEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'isReferralEnabled']))

// show login button redirect for exchange mobile
// will take user out of webview into native signin
export const getExchangeMobileDuplicateAccountRedirect = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'exchangeMobileDuplicateAccountRedirect']))

// show exchange promo card
export const getExchangePromoEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'exchangePromo']))

// secure update endpoint for email and sms
export const getSecureEmailSmsUpdate = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'secureEmailSmsUpdate']))

// dex feature flag
export const getDexProductEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'dex']))

// staking feature flag
export const getIsStakingEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'isStakingEnabled']))

// crates nabu user at login if credentials aren't in metadata
export const createNabuUserAtLogin = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'createNabuUserAtLogin']))

// Staking Promo banner
export const getStakingPromoBannerEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'stakingPromoBanner']))

// Active Rewards Promo banner
export const getActiveRewardsPromoBannerEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'activeRewardsPromoBanner']))

// Settings theme
export const getThemeEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'themeEnabled']))

// use Loqate service for address search
export const useLoqateServiceEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'useLoqateService']))

// Account recovery v2
export const getAccountRecoveryV2 = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'accountRecoveryV2']))

// show active rewards
export const getActiveRewardsEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'isActiveRewardsEnabled']))

// show active rewards withdrawal
export const getActiveRewardsWithdrawalEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'isActiveRewardsWithdrawalEnabled']))

// show staking withdrawal
export const getStakingWithdrawalEnabled = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'isStakingWithdrawalEnabled']))

// show earn available assets checkbox
export const getShowEarnAvailableAssets = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'showEarnAvailableAssetsCheckbox']))

// show prove flow
export const getShowProveFlow = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'showProveFlow']))

// which deposit address to use for swap
export const getUseAgentHotWalletAddress = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'useAgentHotWalletAddress']))

// which deposit address to use for non custodial sell
export const getUseAgentHotWalletAddressForSell = (state: RootState) =>
  getWebOptions(state).map(path(['featureFlags', 'useAgentHotWalletAddressForSell']))
