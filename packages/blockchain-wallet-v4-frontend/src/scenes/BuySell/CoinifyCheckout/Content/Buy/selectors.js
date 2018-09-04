import { formValueSelector } from 'redux-form'
import { lift, path, prop, filter } from 'ramda'
import { selectors, model } from 'data'

const { CHECKOUT_BUY_FORM } = model.coinify

export const getProfileData = state => {
  const profile = selectors.core.data.coinify.getProfile(state)
  const kyc = selectors.core.data.coinify.getKyc(state)
  return lift((profile, kyc) => ({ profile, kyc }))(profile, kyc)
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

export const showRecurringBuy = state => {
  const countryCode = selectors.core.settings.getCountryCode(state).getOrElse('GB')
  const invitedStatus = selectors.core.settings.getInvited(state).getOrElse({})

  const isCardTrade = t =>
    prop('medium', t) === 'card' && prop('state', t) === 'completed'

  const level = selectors.core.data.coinify.getLevel(state).getOrElse()
  const trades = selectors.core.data.coinify.getTrades(state).getOrElse([])
  const ccTrades = filter(isCardTrade, trades)

  const needsTrades = ccTrades < 3
  const needsKyc = parseInt(prop('name', level)) < 2
  const tradeSubscriptionsAllowed = selectors.core.data.coinify.getTradeSubscriptionsAllowed(state).getOrElse(false)

  if (!needsKyc && !needsTrades && !tradeSubscriptionsAllowed) return false
  if (countryCode === 'GB') return false
  return prop('coinifyRecurringBuy', invitedStatus) // if other checks pass, this should be the final one
}

export const getData = state => ({
  base: getBase(state),
  buyQuoteR: getQuote(state),
  canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(false),
  checkoutBusy: path(['coinify', 'checkoutBusy'], state),
  coinifyBusy: path(['coinify', 'coinifyBusy'], state),
  currency: formValueSelector(CHECKOUT_BUY_FORM)(state, 'currency'),
  data: getProfileData(state),
  defaultCurrency: getCurrency(state),
  errors: getErrors(state),
  paymentMedium: path(['coinify', 'medium'], state),
  showRecurringModal: path(['coinify', 'showRecurringModal'], state),
  showRecurringBuy: showRecurringBuy(state),
  step: path(['coinify', 'checkoutStep'], state),
  subscription: path(['coinify', 'subscription'], state),
  subscriptions: getSubscriptions(state),
  subscriptionData: path(['coinify', 'subscriptionData'], state),
  trade: getTrade(state),
  trades: getTrades(state)
})
