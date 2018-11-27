import { formValueSelector } from 'redux-form'
import { lift, path, equals, or } from 'ramda'
import { model, selectors } from 'data'

const { NONE, PENDING, UNDER_REVIEW, VERIFIED } = model.profile.KYC_STATES

export const getProfileData = state => {
  const profile = selectors.core.data.coinify.getProfile(state)
  return lift((profile) => ({ profile }))(profile)
}

export const getTrades = state =>
  selectors.core.data.coinify.getTrades(state).getOrElse(null)

export const getSubscriptions = state =>
  selectors.core.data.coinify.getSubscriptions(state).getOrElse([])

export const getTrade = state =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

export const getQuote = state => selectors.core.data.coinify.getQuote(state)

export const getCurrency = state => selectors.core.data.coinify.getLevel(state)

export const getBase = state =>
  path(['form', 'exchangeCheckout', 'active'], state)

export const getErrors = state =>
  path(['form', 'exchangeCheckout', 'syncErrors'], state)

export const getData = state => {
  const kycState = selectors.modules.profile.getUserKYCState(state)
  return {
    base: getBase(state),
    data: getProfileData(state),
    buyQuoteR: getQuote(state),
    trades: getTrades(state),
    subscriptions: getSubscriptions(state),
    trade: getTrade(state),
    errors: getErrors(state),
    currency: formValueSelector('coinifyCheckoutBuy')(state, 'currency'),
    defaultCurrency: getCurrency(state),
    checkoutBusy: path(['coinify', 'checkoutBusy'], state),
    paymentMedium: path(['coinify', 'medium'], state),
    step: path(['coinify', 'checkoutStep'], state),
    coinifyBusy: path(['coinify', 'coinifyBusy'], state),
    canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(false),
    kycNotFinished: kycState.map(equals(NONE)).getOrElse(false),
    kycPending: kycState.map(kyc => or(equals(kyc, PENDING), equals(kyc, UNDER_REVIEW))).getOrElse(false),
    kycVerified: kycState.map(equals(VERIFIED)).getOrElse(false)
  }
}
