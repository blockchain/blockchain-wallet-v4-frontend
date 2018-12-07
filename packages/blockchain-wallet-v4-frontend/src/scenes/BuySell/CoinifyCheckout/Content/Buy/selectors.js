import { formValueSelector } from 'redux-form'
import { lift, equals } from 'ramda'
import { model, selectors } from 'data'

const { VERIFIED } = model.profile.KYC_STATES

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

export const getData = state => {
  const kycState = selectors.modules.profile.getUserKYCState(state).getOrElse(false)
  const kycVerified = equals(kycState, VERIFIED)

  return {
    data: getProfileData(state),
    buyQuoteR: getQuote(state),
    trades: getTrades(state),
    subscriptions: getSubscriptions(state),
    trade: getTrade(state),
    currency: formValueSelector('coinifyCheckoutBuy')(state, 'currency'),
    defaultCurrency: getCurrency(state),
    checkoutBusy: selectors.modules.coinify.getCoinifyCheckoutBusy(state),
    paymentMedium: selectors.modules.coinify.getCoinifyMedium(state),
    step: selectors.modules.coinify.getCoinifyCheckoutStep(state),
    coinifyBusy: selectors.modules.coinify.getCoinifyBusy(state),
    canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(false),
    kycState,
    kycVerified,
    level: selectors.core.data.coinify.getLevel(state)
  }
}
