import ExchangeDelegate from '../../../exchange/delegate'
import { apply, call, put, select, takeLatest } from 'redux-saga/effects'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import * as buySellAT from '../../kvStore/buySell/actionTypes'
import * as AT from './actionTypes'
import * as A from './actions'

export default ({ api, coinifyService } = {}) => {
  let coinify

  const refreshCoinify = function * () {
    yield put(A.fetchProfileLoading())
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api)
    const value = yield select(buySellSelectors.getMetadata)
    coinify = yield apply(coinifyService, coinifyService.refresh, [value, delegate])
    yield apply(coinify, coinify.profile.fetch)
    yield put(A.fetchProfileSuccess(coinify))
  }

  const init = function * () {
    try {
      yield call(refreshCoinify)
    } catch (e) {
      throw new Error(e)
    }
  }

  const fetchProfile = function * () {
    try {
      yield put(A.fetchProfileLoading())
      yield apply(coinify, coinify.profile.fetch)
      yield put(A.fetchProfileSuccess(coinify.profile))
    } catch (e) {
      yield put(A.fetchProfileFailure(e))
    }
  }

  const fetchQuote = function * (data) {
    try {
      yield put(A.fetchQuoteLoading())
      const { amt, baseCurrency, quoteCurrency } = data.payload
      const quote = yield apply(coinify, coinify.getBuyQuote, [amt, baseCurrency, quoteCurrency])
      yield put(A.fetchQuoteSuccess(quote))
    } catch (e) {
      yield put(A.fetchQuoteFailure(e))
    }
  }

  const fetchQuoteAndMediums = function * (data) {
    try {
      const { amt, baseCurrency, quoteCurrency, medium } = data.payload
      const quote = yield apply(coinify, coinify.getBuyQuote, [amt, baseCurrency, quoteCurrency])
      const mediums = yield apply(quote, quote.getPaymentMediums)
      const account = yield apply(mediums[medium], mediums[medium].getAccounts)
      yield put(A.fetchQuoteSuccess(quote))
      yield put(A.getPaymentMediumsSuccess(mediums))
      yield put(A.getMediumAccountsSuccess(account))
    } catch (e) {
      yield put(A.fetchQuoteFailure(e))
    }
  }

  const fetchRateQuote = function * (data) {
    try {
      yield put(A.fetchRateQuoteLoading())
      const quoteCurr = data.payload
      const quote = yield apply(coinify, coinify.getBuyQuote, [1e8, 'BTC', quoteCurr])
      yield put(A.fetchRateQuoteSuccess(quote))
    } catch (e) {
      yield put(A.fetchRateQuoteFailure(e))
    }
  }

  const fetchTrades = function * () {
    try {
      yield put(A.fetchTradesLoading())
      const trades = yield apply(coinify, coinify.getTrades)
      yield put(A.fetchTradesSuccess(trades))
    } catch (e) {
      yield put(A.fetchTradesFailure(e))
    }
  }

  const fetchAccounts = function * () {
    try {
      yield put(A.fetchAccountsLoading())
      const methods = yield apply(coinify, coinify.getBuyMethods)
      const accounts = yield apply(coinify, methods.ach.getAccounts)
      yield put(A.fetchAccountsSuccess(accounts))
    } catch (e) {
      yield put(A.fetchAccountsFailure(e))
    }
  }

  const resetProfile = function * () {
    yield put(A.resetProfile())
  }

  const getPaymentMediums = function * (data) {
    const quote = data.payload
    try {
      yield put(A.getPaymentMediumsLoading())
      const mediums = yield apply(quote, quote.getPaymentMediums)
      yield put(A.getPaymentMediumsSuccess(mediums))
    } catch (e) {
      yield put(A.getPaymentMediumsFailure(e))
    }
  }

  const getMediumAccounts = function * (data) {
    const medium = data.payload
    try {
      const account = yield apply(medium, medium.getAccounts)
      yield put(A.getMediumAccountsSuccess(account))
    } catch (e) {
      yield put(A.getMediumAccountsFailure(e))
    }
  }

  return function * () {
    yield takeLatest(buySellAT.FETCH_METADATA_BUYSELL_SUCCESS, init)
    yield takeLatest(AT.FETCH_ACCOUNTS, fetchAccounts)
    yield takeLatest(AT.COINIFY_FETCH_PROFILE, fetchProfile)
    yield takeLatest(AT.COINIFY_FETCH_TRADES, fetchTrades)
    yield takeLatest(AT.COINIFY_FETCH_QUOTE, fetchQuote)
    yield takeLatest(AT.COINIFY_FETCH_RATE_QUOTE, fetchRateQuote)
    yield takeLatest(AT.RESET_PROFILE, resetProfile)
    yield takeLatest(AT.GET_PAYMENT_MEDIUMS, getPaymentMediums)
    yield takeLatest(AT.COINIFY_GET_MEDIUM_ACCOUNTS, getMediumAccounts)
    yield takeLatest(AT.COINIFY_FETCH_QUOTE_AND_MEDIUMS, fetchQuoteAndMediums)
  }
}
