import { apply, call, delay, put, select } from 'redux-saga/effects'

import ExchangeDelegate from '../../../exchange/delegate'
import * as A from './actions'
import * as S from './selectors'
import * as walletActions from '../../wallet/actions'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import { coinifyService } from '../../../exchange/service'
import * as buySellA from '../../kvStore/buySell/actions'
import { equals, head, prop, sort, path } from 'ramda'
import settingsSagaFactory from '../../settings/sagas'

export default ({ api }) => {
  const settingsSagas = settingsSagaFactory({ api })
  const getCoinify = function * () {
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api, 'coinify')
    const value = yield select(buySellSelectors.getMetadata)
    const walletOptions = state.walletOptionsPath.data
    let coinify = yield apply(coinifyService, coinifyService.refresh, [
      value,
      delegate,
      walletOptions
    ])
    yield apply(coinify, coinify.profile.fetch)
    yield put(A.coinifyFetchProfileSuccess(coinify))
    return coinify
  }

  let coinify

  const refreshCoinify = function * () {
    yield put(A.coinifyFetchProfileLoading())
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api, 'coinify')
    const value = yield select(buySellSelectors.getMetadata)
    const walletOptions = state.walletOptionsPath.data
    coinify = yield apply(coinifyService, coinifyService.refresh, [
      value,
      delegate,
      walletOptions
    ])
    yield apply(coinify, coinify.profile.fetch)
    yield put(A.coinifyFetchProfileSuccess(coinify))
  }

  const init = function * () {
    try {
      const val = yield select(buySellSelectors.getMetadata)
      if (!path(['data', 'value', 'coinify', 'offline_token'], val)) return
      yield call(refreshCoinify)
    } catch (e) {
      console.warn(e)
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
      const getQuote =
        type === 'sell' ? coinify.data.getSellQuote : coinify.data.getBuyQuote
      const quote = yield apply(coinify.data, getQuote, [
        Math.floor(amount),
        baseCurrency,
        quoteCurrency
      ])
      yield put(A.fetchQuoteSuccess(quote))
      return quote
    } catch (e) {
      yield put(A.fetchQuoteFailure(e))
    }
  }

  const refreshBuyQuote = function * () {
    try {
      const quote = yield select(S.getQuote)
      const qData = path(['data'], quote)

      let quotePayload = {
        amount:
          qData.baseCurrency === 'BTC'
            ? (qData.baseAmount * -1) / 1e8
            : qData.baseAmount * -1 * 100,
        baseCurrency: qData.baseCurrency,
        quoteCurrency: qData.quoteCurrency,
        type: 'buy'
      }

      const refreshedQuote = yield call(fetchQuote, { quote: quotePayload })
      yield call(getPaymentMediums, { payload: refreshedQuote })
    } catch (e) {
      yield put(A.fetchQuoteFailure(e))
    }
  }

  const refreshSellQuote = function * () {
    try {
      const quote = yield select(S.getQuote)
      const qData = path(['data'], quote)

      let quotePayload = {
        baseCurrency: qData.baseCurrency,
        quoteCurrency: qData.quoteCurrency,
        type: 'sell'
      }

      if (qData.baseCurrency !== 'BTC') {
        quotePayload['amount'] = qData.baseAmount * 100
      } else quotePayload['amount'] = qData.baseAmount / 1e8
      const refreshedQuote = yield call(fetchQuote, { quote: quotePayload })
      yield call(getPaymentMediums, { payload: refreshedQuote })
    } catch (e) {
      yield put(A.fetchQuoteFailure(e))
    }
  }

  const fetchQuoteAndMediums = function * (data) {
    try {
      const { amt, baseCurrency, quoteCurrency, medium, type } = data.payload
      const getQuote =
        type === 'sell' ? coinify.data.getSellQuote : coinify.data.getBuyQuote
      const quote = yield apply(coinify, getQuote, [
        amt,
        baseCurrency,
        quoteCurrency
      ])
      yield put(A.fetchQuoteSuccess(quote))
      const mediums = yield apply(quote, quote.getPaymentMediums)
      const account = yield apply(mediums[medium], mediums[medium].getAccounts)
      yield put(A.getMediumAccountsSuccess(account))
    } catch (e) {
      yield put(A.fetchQuoteFailure(e))
    }
  }

  const fetchRateQuote = function * (data) {
    try {
      const coinify = yield select(S.getProfile)
      yield put(A.fetchRateQuoteLoading())
      const { currency, type } = data.payload
      const getQuote =
        type === 'sell' ? coinify.data.getSellQuote : coinify.data.getBuyQuote
      const quote = yield apply(coinify.data, getQuote, [-1e8, 'BTC', currency])
      yield call(getPaymentMediums, { payload: quote })
      yield put(A.fetchRateQuoteSuccess(quote))
    } catch (e) {
      console.log(e)
      yield put(A.fetchRateQuoteFailure(e))
    }
  }

  const fetchTrades = function * (coinifyObj) {
    try {
      const payload = prop('payload', coinifyObj)
      const coinify = !payload ? yield call(getCoinify) : payload
      const trades = yield apply(coinify, coinify.getTrades)
      yield put(A.fetchTradesSuccess(trades))
    } catch (e) {
      yield put(A.fetchTradesFailure(e))
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
      return mediums
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
      yield put(A.setBankAccount(bankAccount))
    } catch (e) {
      console.log(e)
    }
  }

  const deleteBankAccount = function * (data) {
    try {
      const account = data.payload
      yield apply(account, account.delete)
    } catch (e) {
      console.log(e)
    }
  }

  const signup = function * (data) {
    const countryCode = data
    let fiatCurrency

    if (countryCode === 'DK') fiatCurrency = 'DKK'
    else if (countryCode === 'GB') fiatCurrency = 'GBP'
    else fiatCurrency = 'EUR'

    try {
      const coinify = yield call(getCoinify)
      const signupResponse = yield apply(coinify, coinify.signup, [
        countryCode,
        fiatCurrency
      ])
      yield put(buySellA.coinifySetProfileBuySell(signupResponse))
      yield put(A.coinifySetToken(signupResponse))
    } catch (e) {
      yield put(A.coinifySignupFailure(e))
    }
  }

  const buy = function * (data, addressData) {
    const { quote, medium } = data.payload
    try {
      yield put(A.handleTradeLoading())
      const mediums = yield apply(quote, quote.getPaymentMediums)
      const accounts = yield apply(mediums[medium], mediums[medium].getAccounts)
      const buyResult = yield apply(accounts[0], accounts[0].buy)
      yield put(A.handleTradeSuccess(buyResult))
      yield call(settingsSagas.setLastTxTime)
      const coinifyObj = yield call(getCoinify)
      yield put(A.fetchTrades(coinifyObj))

      // save trade to metadata
      yield put(buySellA.addCoinifyTradeBuySell(buyResult))

      yield call(labelAddressForBuy, buyResult, addressData)
      return buyResult
    } catch (e) {
      yield put(A.handleTradeFailure(e))
    }
  }

  const labelAddressForBuy = function * (trade, addressData) {
    try {
      trade._account_index = addressData.accountIndex
      trade._receive_index = addressData.index
      const id = trade.tradeSubscriptionId || trade.id

      yield put(
        walletActions.setHdAddressLabel(
          addressData.accountIndex,
          addressData.index,
          `Coinify order #${id}`
        )
      )
    } catch (e) {
      yield put(A.handleTradeFailure(e))
    }
  }

  const sell = function * () {
    try {
      yield put(A.handleTradeLoading())
      const account = yield select(S.getAccount)
      const sellResult = yield apply(account, account.sell)
      yield put(A.handleTradeSuccess(sellResult))
      yield put(A.fetchTrades())
      yield call(getCoinify)
      yield put(buySellA.addCoinifyTradeBuySell(sellResult))
      return sellResult
    } catch (e) {
      yield put(A.handleTradeFailure(e))
    }
  }

  const cancelTrade = function * ({ trade }) {
    try {
      yield apply(trade, trade.cancel)
      yield call(fetchTrades)
      if (prop('tradeSubscriptionId', trade)) {
        yield call(fetchSubscriptions)
      }
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
      yield put(A.getKyc())
      return kyc
    } catch (e) {
      yield put(A.handleTradeFailure(e))
    }
  }

  const getKYC = function * () {
    try {
      yield put(A.getKYCLoading())
      const coinify = yield call(getCoinify)
      const kycs = yield apply(coinify, coinify.getKYCs)
      const byTime = (a, b) => prop('createdAt', b) - prop('createdAt', a)
      const kyc = head(sort(byTime, kycs))
      yield put(A.getKYCSuccess(kyc))
      return kyc
    } catch (e) {
      yield put(A.getKYCFailure(e))
    }
  }

  const pollKYCPending = function * () {
    try {
      const kyc = yield select(S.getKyc)
      let status = kyc.map(prop('state')).getOrElse(undefined)
      while (equals(status, 'pending')) {
        yield delay(1000)
        const kycR = yield select(S.getKyc)
        const kyc = kycR.getOrElse(undefined)
        if (!kyc) {
          return
        }
        yield apply(kyc, kyc.refresh)
        status = prop('state', kyc)
        yield put(A.getKYCSuccess(kyc))
      }
    } catch (e) {
      yield put(A.getKYCFailure(e))
    }
  }

  const kycAsTrade = function * (data) {
    const { kyc } = data
    try {
      yield put(A.handleTradeSuccess(kyc))
    } catch (e) {
      yield put(A.handleTradeFailure(e))
    }
  }

  const fetchSubscriptions = function * () {
    try {
      // const coinify = yield call(getCoinify)
      yield put(A.fetchSubscriptionsLoading())
      const subs = yield apply(coinify, coinify.getSubscriptions)
      yield put(A.fetchSubscriptionsSuccess(subs))
    } catch (e) {
      yield put(A.fetchSubscriptionsFailure(e))
    }
  }

  const cancelSubscription = function * ({ id }) {
    try {
      yield call(refreshCoinify)
      const cancelSub = yield apply(coinify, coinify.cancelSubscription, [id])
      yield call(fetchSubscriptions)
      return cancelSub
    } catch (e) {
      console.warn(e)
    }
  }

  return {
    signup,
    buy,
    sell,
    init,
    coinifyFetchProfile,
    fetchTrades,
    fetchSubscriptions,
    fetchQuote,
    fetchRateQuote,
    resetProfile,
    getPaymentMediums,
    getMediumAccounts,
    getMediumsWithBankAccounts,
    addBankAccount,
    deleteBankAccount,
    fetchQuoteAndMediums,
    cancelTrade,
    cancelSubscription,
    triggerKYC,
    getKYC,
    kycAsTrade,
    pollKYCPending,
    refreshBuyQuote,
    refreshSellQuote
  }
}
