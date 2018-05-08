import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default ({ api, options }) => {
  const coinifySagas = sagas({ api, options })

  return function * () {
    yield takeLatest(actionTypes.kvStore.buySell.FETCH_METADATA_BUYSELL_SUCCESS, coinifySagas.init)
    yield takeLatest(AT.FETCH_ACCOUNTS, coinifySagas.fetchAccounts)
    yield takeLatest(AT.COINIFY_FETCH_PROFILE, coinifySagas.coinifyFetchProfile)
    yield takeLatest(AT.COINIFY_FETCH_TRADES, coinifySagas.fetchTrades)
    yield takeLatest(AT.COINIFY_FETCH_QUOTE, coinifySagas.fetchQuote)
    yield takeLatest(AT.COINIFY_FETCH_RATE_QUOTE, coinifySagas.fetchRateQuote)
    yield takeLatest(AT.RESET_PROFILE, coinifySagas.resetProfile)
    yield takeLatest(AT.COINIFY_GET_PAYMENT_MEDIUMS, coinifySagas.getPaymentMediums)
    yield takeLatest(AT.COINIFY_GET_MEDIUM_ACCOUNTS, coinifySagas.getMediumAccounts)
    yield takeLatest(AT.COINIFY_FETCH_QUOTE_AND_MEDIUMS, coinifySagas.fetchQuoteAndMediums)
    yield takeLatest(AT.COINIFY_CANCEL_TRADE, coinifySagas.cancelTrade)
    yield takeLatest(AT.COINIFY_BUY, coinifySagas.buy)
    yield takeLatest(AT.COINIFY_SELL, coinifySagas.sell)
    yield takeLatest(AT.GET_KYCS, coinifySagas.getKYCs)
  }
}
