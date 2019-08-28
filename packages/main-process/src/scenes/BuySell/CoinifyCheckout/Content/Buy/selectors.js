import { formValueSelector } from 'redux-form'
import { lift, equals, prop } from 'ramda'
import { model, selectors } from 'data'

const { TIERS_STATES } = model.profile

export const getProfileData = state => {
  const profile = selectors.core.data.coinify.getProfile(state)
  return lift(profile => ({ profile }))(profile)
}

export const getTrades = state =>
  selectors.core.data.coinify.getTrades(state).getOrElse(null)

export const getSubscriptions = state =>
  selectors.core.data.coinify.getSubscriptions(state).getOrElse([])

export const getTrade = state =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

export const getQuote = state => selectors.core.data.coinify.getQuote(state)

export const getData = state => {
  const kycState = selectors.modules.profile
    .getUserKYCState(state)
    .getOrElse(false)
  const tier2Data = selectors.modules.profile.getTier(state, 2).getOrElse(null)
  const kycVerified = equals(prop('state', tier2Data), TIERS_STATES.VERIFIED)

  return {
    data: getProfileData(state),
    buyQuoteR: getQuote(state),
    trades: getTrades(state),
    subscriptions: getSubscriptions(state),
    trade: getTrade(state),
    canTrade: selectors.core.data.coinify.canTrade(state),
    rateQuoteR: selectors.core.data.coinify.getRateQuote(state),
    cannotTradeReason: selectors.core.data.coinify.cannotTradeReason(state),
    canTradeAfter: selectors.core.data.coinify.canTradeAfter(state),
    currency: formValueSelector('coinifyCheckoutBuy')(state, 'currency'),
    checkoutBusy: selectors.components.coinify.getCoinifyCheckoutBusy(state),
    checkoutError: selectors.components.coinify.getCoinifyCheckoutError(state),
    paymentMedium: selectors.components.coinify.getCoinifyMedium(state),
    step: selectors.components.coinify.getCoinifyCheckoutStep(state),
    coinifyBusy: selectors.components.coinify.getCoinifyBusy(state),
    kycState,
    kycVerified
  }
}
