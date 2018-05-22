import ExchangeDelegate from '../../../exchange/delegate'
import { apply, call, put, select } from 'redux-saga/effects'
import * as A from './actions'
import * as S from './selectors'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import { coinifyService } from '../../../exchange/service'
import * as buySellA from '../../kvStore/buySell/actions'
import { prop, sort } from 'ramda'

export default ({ api, options }) => {
  const getCoinify = function * () {
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api)
    const value = yield select(buySellSelectors.getMetadata)
    const walletOptions = state.walletOptionsPath.data
    let coinify = yield apply(coinifyService, coinifyService.refresh,
      [value, delegate, walletOptions])
    yield apply(coinify, coinify.profile.fetch)
    yield put(A.coinifyFetchProfileSuccess(coinify))
    return coinify
  }

  let coinify

  const refreshCoinify = function * () {
    yield put(A.coinifyFetchProfileLoading())
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api)
    const value = yield select(buySellSelectors.getMetadata)

    const walletOptions = state.walletOptionsPath.data
    coinify = yield apply(coinifyService, coinifyService.refresh,
      [value, delegate, walletOptions])
    yield apply(coinify, coinify.profile.fetch)
    yield put(A.coinifyFetchProfileSuccess(coinify))
  }

  const init = function * () {
    try {
      yield call(refreshCoinify)
    } catch (e) {
      console.warn(e)
      // throw new Error(e)
    }
  }

  const coinifyFetchProfile = function * (noLoad) {
    try {
      yield put(A.coinifyFetchProfileLoading())
      yield apply(coinify, coinify.profile.fetch)
      yield put(A.coinifyFetchProfileSuccess(coinify.profile))
    } catch (e) {
      yield put(A.coinifyFetchProfileFailure(e))
    }
  }

  const fetchQuote = function * (data) {
    try {
      const coinify = yield select(S.getProfile)
      yield put(A.fetchQuoteLoading())
      const { amount, baseCurrency, quoteCurrency, type } = data.quote
      const getQuote = type === 'sell'
        ? coinify.data.getSellQuote
        : coinify.data.getBuyQuote
      const quote = yield apply(coinify.data, getQuote,
        [Math.floor(amount), baseCurrency, quoteCurrency])
      yield put(A.fetchQuoteSuccess(quote))
      return quote
    } catch (e) {
      yield put(A.fetchQuoteFailure(e))
    }
  }

  const fetchQuoteAndMediums = function * (data) {
    try {
      const { amt, baseCurrency, quoteCurrency, medium, type } = data.payload
      const getQuote = type === 'sell'
        ? coinify.data.getSellQuote
        : coinify.data.getBuyQuote
      const quote = yield apply(coinify, getQuote, [amt, baseCurrency, quoteCurrency])
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
      const { currency, type } = data.payload
      const getQuote = type === 'sell' ? coinify.getSellQuote : coinify.getBuyQuote
      const quote = yield apply(coinify, getQuote, [-1e8, 'BTC', currency])
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
    try {
      const quote = data.payload
      yield put(A.getPaymentMediumsLoading())
      const mediums = yield apply(quote, quote.getPaymentMediums)
      yield put(A.getPaymentMediumsSuccess(mediums))
    } catch (e) {
      yield put(A.getPaymentMediumsFailure(e))
    }
  }

  const getMediumAccounts = function * (data) {
    try {
      const medium = data.payload
      const account = yield apply(medium, medium.getAccounts)
      yield put(A.getMediumAccountsSuccess(account))
    } catch (e) {
      yield put(A.getMediumAccountsFailure(e))
    }
  }

  // Used in sell to get mediums with accounts
  const getMediumsWithBankAccounts = function * (data) {
    try {
      const quote = data.payload
      yield put(A.getPaymentMediumsLoading())
      const mediums = yield apply(quote, quote.getPaymentMediums)
      const medium = prop('bank', mediums)
      yield apply(medium, medium.getBankAccounts)
      yield put(A.getPaymentMediumsSuccess(mediums))
    } catch (e) {
      console.log(e)
      yield put(A.getPaymentMediumsFailure(e))
    }
  }

  const addBankAccount = function * (data) {
    try {
      const { medium, account } = data.payload
      const bankAccount = yield apply(medium, medium.addBankAccount, [account])
      console.log(bankAccount)
      console.log('A bank account was added')
      // yield put(A.addBankAccountSuccess(bankAccount))
    } catch (e) {
      console.log(e)
      // yield put(A.addBankAccountFailure(e))
    }
  }

  const signup = function * () {
    const countryCode = 'FR' // TODO should be passed in
    const fiatCurrency = 'EUR' // TODO should be passed in
    try {
      const coinify = yield call(getCoinify)
      const signupResponse = yield apply(coinify, coinify.signup,
        [countryCode, fiatCurrency])
      // TODO countryCode and fiatCurrency passed in as args

      yield put(buySellA.coinifySetProfileBuySell(signupResponse))
      yield put(A.coinifySetToken(signupResponse))
    } catch (e) {
      console.log('coinify signup error:', e)
      yield put(A.coinifySignupFailure(e))
    }
  }

  const buy = function * (data) {
    const { quote, medium } = data.payload
    try {
      yield put(A.handleTradeLoading())
      console.log('core saga buy', data.payload)
      const mediums = yield apply(quote, quote.getPaymentMediums)
      const accounts = yield apply(mediums[medium], mediums[medium].getAccounts)
      const buyResult = yield apply(accounts[0], accounts[0].buy)
      yield put(A.handleTradeSuccess(buyResult))
      console.log('coinify buy result in core', buyResult)
      yield put(A.fetchTrades())
      yield call(getCoinify)
      return buyResult
    } catch (e) {
      console.warn('buy failed in core', e)
      yield put(A.handleTradeFailure(e))
    }
  }

  const sell = function * (data) {
    const { quote, medium } = data.payload
    try {
      yield put(A.handleTradeLoading())
      console.log('core saga sell', data.payload)
      const mediums = yield apply(quote, quote.getPaymentMediums)
      const accounts = yield apply(mediums[medium], mediums[medium].getAccounts)
      const sellResult = yield apply(accounts[0], accounts[0].sell)
      yield put(A.handleTradeSuccess(sellResult))
      console.log('coinify sell result in core', sellResult)
      yield put(A.fetchTrades())
      yield call(getCoinify)
      return sellResult
    } catch (e) {
      console.warn('sell failed in core', e)
      yield put(A.handleTradeFailure(e))
    }
  }

  const cancelTrade = function * (trade) {
    try {
      const trades = yield select(S.getTrades)
      const trade = trades.data[0]
      yield apply(trade, trade.cancel)
      yield call(getCoinify)
    } catch (e) {
      console.log('issue cancelling trade', e)
    }
  }

  const triggerKYC = function * () {
    try {
      yield put(A.handleTradeLoading())
      const coinify = yield call(getCoinify)
      const kyc = yield apply(coinify, coinify.triggerKYC)
      yield put(A.handleTradeSuccess(kyc))
      yield put(A.getKycs())
      return kyc
    } catch (e) {
      yield put(A.handleTradeFailure(e))
      console.log('failed to trigger KYC in core', e)
    }
  }

  const getKYCs = function * () {
    try {
      yield put(A.getKYCsLoading())
      const coinify = yield call(getCoinify)
      const kycs = yield apply(coinify, coinify.getKYCs)
      const byTime = (a, b) => b.createdAt - a.createdAt
      const sortedKYCs = sort(byTime, kycs)

      yield put(A.getKYCsSuccess(sortedKYCs))
      return kycs
    } catch (e) {
      console.log('getKYCs failure', e)
      yield put(A.getKYCsFailure(e))
    }
  }

  const kycAsTrade = function * (data) {
    const { kyc } = data
    try {
      yield put(A.handleTradeSuccess(kyc))
    } catch (e) {
      console.log('kycAsTrade failure', e)
    }
  }

  return {
    signup,
    buy,
    sell,
    init,
    fetchAccounts,
    coinifyFetchProfile,
    fetchTrades,
    fetchQuote,
    fetchRateQuote,
    resetProfile,
    getPaymentMediums,
    getMediumAccounts,
    getMediumsWithBankAccounts,
    addBankAccount,
    fetchQuoteAndMediums,
    cancelTrade,
    triggerKYC,
    getKYCs,
    kycAsTrade
  }
}
