import { formValueSelector } from 'redux-form'
import { lift, equals } from 'ramda'
import { selectors, model } from 'data'

const { VERIFIED } = model.profile.KYC_STATES

export const getUserData = state => {
  const profile = selectors.core.data.coinify.getProfile(state)
  const payment = selectors.modules.coinify.getCoinifyPayment(state)
  return lift((profile, payment) => ({ profile, payment }))(
    profile,
    payment
  )
}

export const getTrades = state =>
  selectors.core.data.coinify.getTrades(state).getOrElse(null)

export const getTrade = state =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

export const getQuote = state => selectors.core.data.coinify.getQuote(state)

export const getCurrency = state => selectors.core.data.coinify.getLevel(state)

export const getData = state => {
  const kycState = selectors.modules.profile
    .getUserKYCState(state)
    .getOrElse(false)
  const kycVerified = equals(kycState, VERIFIED)
  return {
    data: getUserData(state),
    sellQuoteR: getQuote(state),
    trade: getTrade(state),
    currency: formValueSelector('coinifyCheckoutSell')(state, 'currency'),
    defaultCurrency: getCurrency(state),
    checkoutBusy: selectors.modules.coinify.getCoinifyCheckoutBusy(state),
    paymentMedium: selectors.modules.coinify.getCoinifyMedium(state),
    step: selectors.modules.coinify.getCoinifyCheckoutStep(state),
    coinifyBusy: selectors.modules.coinify.getCoinifyBusy(state),
    checkoutError: selectors.modules.coinify.getCoinifyCheckoutError(state),
    canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(false),
    kycState,
    kycVerified,
    level: selectors.core.data.coinify.getLevel(state)
  }
}
