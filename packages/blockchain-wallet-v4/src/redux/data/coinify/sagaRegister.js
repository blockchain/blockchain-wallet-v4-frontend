import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default ({ api, options }) => {
  const coinifySagas = sagas({ api, options })

  return function* coreDataCoinifySaga () {
    yield takeLatest(
      actionTypes.kvStore.buySell.FETCH_METADATA_BUYSELL_SUCCESS,
      coinifySagas.init
    )
    yield takeLatest(AT.COINIFY_FETCH_PROFILE, coinifySagas.coinifyFetchProfile)
    yield takeLatest(AT.COINIFY_FETCH_TRADES, coinifySagas.fetchTrades)
    yield takeLatest(
      AT.COINIFY_FETCH_SUBSCRIPTIONS,
      coinifySagas.fetchSubscriptions
    )
    yield takeLatest(AT.COINIFY_FETCH_QUOTE, coinifySagas.fetchQuote)
    yield takeLatest(AT.COINIFY_FETCH_RATE_QUOTE, coinifySagas.fetchRateQuote)
    yield takeLatest(AT.RESET_PROFILE, coinifySagas.resetProfile)
    yield takeLatest(
      AT.COINIFY_GET_PAYMENT_MEDIUMS,
      coinifySagas.getPaymentMediums
    )
    yield takeLatest(
      AT.COINIFY_GET_MEDIUM_ACCOUNTS,
      coinifySagas.getMediumAccounts
    )
    yield takeLatest(
      AT.COINIFY_GET_BANK_ACCOUNTS,
      coinifySagas.getMediumsWithBankAccounts
    )
    yield takeLatest(AT.COINIFY_ADD_BANK_ACCOUNT, coinifySagas.addBankAccount)
    yield takeLatest(
      AT.COINIFY_FETCH_QUOTE_AND_MEDIUMS,
      coinifySagas.fetchQuoteAndMediums
    )
    yield takeLatest(AT.COINIFY_CANCEL_TRADE, coinifySagas.cancelTrade)
    yield takeLatest(AT.COINIFY_BUY, coinifySagas.buy)
    yield takeLatest(AT.COINIFY_SELL, coinifySagas.sell)
    yield takeLatest(AT.GET_KYC, coinifySagas.getKYC)
    yield takeLatest(AT.COINIFY_REFRESH_BUY_QUOTE, coinifySagas.refreshBuyQuote)
    yield takeLatest(
      AT.COINIFY_REFRESH_SELL_QUOTE,
      coinifySagas.refreshSellQuote
    )
    yield takeLatest(AT.POLL_KYC_PENDING, coinifySagas.pollKYCPending)
  }
}
