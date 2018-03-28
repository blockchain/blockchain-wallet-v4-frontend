import ExchangeDelegate from '../../../exchange/delegate'
import { delay } from 'redux-saga'
import { apply, call, put, select, takeLatest } from 'redux-saga/effects'
import { assoc, compose, where, equals, or, is, converge, merge } from 'ramda'
import { HDAccount } from '../../../types'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import * as buySellAT from '../../kvStore/buySell/actionTypes'
import * as buySellA from '../../kvStore/buySell/actions'
import { bitcoin as createBitcoinSagas } from '../bitcoin/sagas'
import { descentDraw } from '../../../coinSelection'
import * as bitcoinSelectors from '../bitcoin/selectors'
import * as walletSelectors from '../../wallet/selectors'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as A from './actions'
let sfox

export default ({ api, sfoxService } = {}) => {
  const bitcoinSagas = createBitcoinSagas({ api })

  const refreshSFOX = function * () {
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api)
    const value = yield select(buySellSelectors.getMetadata)
    sfox = sfoxService.refresh(value, delegate)
  }

  const init = function * () {
    try {
      yield call(refreshSFOX)
    } catch (e) {
      throw new Error(e)
    }
  }

  const fetchProfile = function * () {
    try {
      yield put(A.fetchProfileLoading())
      const profile = yield apply(sfox, sfox.fetchProfile)
      yield put(A.fetchProfileSuccess(profile))
    } catch (e) {
      yield put(A.fetchProfileFailure(e))
    }
  }

  const fetchQuote = function * (data) {
    try {
      yield put(A.fetchQuoteLoading())
      const nextAddress = data.payload.nextAddress
      yield put(A.setNextAddress(nextAddress))
      yield call(refreshSFOX)
      const { amt, baseCurr, quoteCurr } = data.payload.quote
      const quote = yield apply(sfox, sfox.getBuyQuote, [amt, baseCurr, quoteCurr])
      yield put(A.fetchQuoteSuccess(quote))
    } catch (e) {
      yield put(A.fetchQuoteFailure(e))
    }
  }

  const fetchBareQuote = function * (data) {
    try {
      let { action, amount, amountCurrency, baseCurrency, quoteCurrency } = data.payload

      yield put(A.fetchBareQuoteLoading())
      yield call(refreshSFOX)

      let getQuote = () => sfox._api.POST(
        'quote/',
        {
          action: action,
          base_currency: baseCurrency,
          quote_currency: quoteCurrency,
          amount: Math.abs(amount).toString(),
          amount_currency: amountCurrency.toLowerCase()
        },
        'v1',
        'quotes'
      ).then(compose(
        assoc('input', action === 'buy' ? quoteCurrency : baseCurrency),
        assoc('output', action === 'buy' ? baseCurrency : quoteCurrency)
      ))

      let quote = yield call(getQuote)

      yield put(A.fetchBareQuoteSuccess(quote))
    } catch (e) {
      yield put(A.fetchBareQuoteFailure(e))
    }
  }

  const buyShape = where({
    quote_id: is(String),
    destination: where({
      type: equals('address'),
      address: is(String)
    }),
    payment_method_id: is(String)
  })

  const sellShape = where({
    quote_id: is(String),
    destination: where({
      type: equals('payment_method'),
      payment_method_id: is(String)
    })
  })

  const tradeShape = converge(or, [buyShape, sellShape])

  const submitTrade = function * (trade) {
    if (!tradeShape(trade)) throw new Error('invalid_trade_shape')
    return yield call(() => sfox._api.authPOST('transaction', trade))
  }

  const fetchTrades = function * () {
    try {
      yield put(A.fetchTradesLoading())
      const trades = yield apply(sfox, sfox.getTrades)
      yield put(A.fetchTradesSuccess(trades))
    } catch (e) {
      yield put(A.fetchTradesFailure(e))
    }
  }

  const fetchAccounts = function * () {
    try {
      yield put(A.fetchAccountsLoading())
      const methods = yield apply(sfox, sfox.getBuyMethods)
      const accounts = yield apply(sfox, methods.ach.getAccounts)
      yield put(A.fetchAccountsSuccess(accounts))
    } catch (e) {
      yield put(A.fetchAccountsFailure(e))
    }
  }

  const handleTrade = function * (data) {
    try {
      yield put(A.handleTradeLoading())
      const quote = data.payload
      const accounts = yield select(S.getAccounts)
      const methods = yield apply(quote, quote.getPaymentMediums)
      const trade = yield apply(methods.ach, methods.ach.buy, [accounts.data[0]])
      yield put(A.handleTradeSuccess(trade))
      yield call(fetchTrades)
      const trades = yield select(S.getTrades)
      yield put(buySellA.setTradesBuySell(trades.data))
    } catch (e) {
      yield put(A.handleTradeFailure(e))
    }
  }

  const getBankAccounts = function * (data) {
    const token = data.payload
    try {
      const bankAccounts = yield apply(sfox.bankLink, sfox.bankLink.getAccounts, [token])
      yield put(A.getBankAccountsSuccess(bankAccounts))
    } catch (e) {
      yield put(A.getBankAccountsFailure(e))
    }
  }

  const resetProfile = function * () {
    yield put(A.resetProfile())
  }

  const signup = function * () {
    try {
      const sfox = yield call(refreshSFOX)
      const signupResponse = yield apply(sfox, sfox.signup)

      yield put(buySellA.setProfileBuySell(signupResponse))
      yield put(A.signupSuccess(signupResponse))
    } catch (e) {
      yield put(A.signupFailure(e))
    }
  }

  const generateBtcDestination = function * () {
    let defaultAccount = yield select(walletSelectors.getDefaultAccount)
    let receiveIndexR = yield select(bitcoinSelectors.getReceiveIndex(defaultAccount.xpub))

    let address = receiveIndexR
      .map((index) => HDAccount.getReceiveAddress(defaultAccount, index))
      .getOrFail(new Error('receive_index_not_found'))

    return { type: 'address', address }
  }

  const generatePaymentMethodDestination = function * () {
    let accountsR = yield select(S.getAccounts)

    let id = accountsR
      .map((accounts) => accounts[0].id)
      .getOrFail(new Error('sfox_accounts_missing'))

    return { type: 'payment_method', payment_method_id: id }
  }

  const publishPayment = function * (from, to, amount, { password, network } = {}) {
    throw new Error('publishPayment_UNIMPLEMENTED')
    // let defaultAccount = yield select(walletSelectors.getDefaultAccount)
    // let changeIndexR = yield select(bitcoinSelectors.getChangeIndex(defaultAccount.xpub))
    //
    // let changeAddress = changeIndexR
    //   .map((index) => HDAccount.getChangeAddress(defaultAccount, index, network))
    //   .getOrFail(new Error('change_index_not_found'))
    //
    // let feePerByte = 5
    // let coins = yield call(bitcoinSagas.fetchUnspent, [from])
    // let selection = descentDraw([to], feePerByte, coins, changeAddress)
    //
    // return yield call(bitcoinSagas.signAndPublish, { selection, password })
  }

  // Entry point
  const sfoxSubmitQuote = function * (action) {
    let quote = action.payload
    yield put(A.handleTradeLoading())
    yield put(A.relayToTradeOutput(quote, quote.output))
  }

  // Handle trade output kind
  const sfoxTradeActorOutputUsd = function * (action) {
    let destination = yield call(generatePaymentMethodDestination)
    let tradeReq = { quote_id: action.payload.quote_id, destination }
    let tradeResult = yield call(submitTrade, tradeReq)
    yield put(A.relayToTradeInput(tradeResult, action.payload.input))
  }

  const sfoxTradeActorOutputBtc = function * (action) {
    let destination = yield call(generateBtcDestination)
    let trade = { quote_id: action.payload.quote_id, destination }
    yield put(A.relayToTradeInput(trade, action.payload.input))
  }

  // Handle trade input kind
  const sfoxTradeActorInputUsd = function * (action) {
    let { payment_method_id } = yield call(generatePaymentMethodDestination)
    let tradeReq = merge(action.payload, { payment_method_id })
    let tradeResult = yield submitTrade(tradeReq)
    yield put(A.submitTrade(tradeResult))
  }

  const sfoxTradeActorInputBtc = function * (action) {
    yield call(publishPayment, action.payload.address)
    yield put(A.submitTrade(action.payload))
  }

  // Exit point
  const sfoxSubmitTrade = function * (action) {
    yield put(A.handleTradeSuccess(action.payload))
  }

  const wrapWithTradeErrorHandler = (genf) => {
    return function * (...args) {
      try {
        yield call(genf, ...args)
      } catch (e) {
        let error = is(String, e) ? new Error(e) : e
        yield put(A.handleTradeFailure(error))
      }
    }
  }

  return function * () {
    yield takeLatest(AT.SUBMIT_QUOTE, sfoxSubmitQuote)
    yield takeLatest(AT.createTradeOutputAction('USD'), wrapWithTradeErrorHandler(sfoxTradeActorOutputUsd))
    yield takeLatest(AT.createTradeOutputAction('BTC'), wrapWithTradeErrorHandler(sfoxTradeActorOutputBtc))
    yield takeLatest(AT.createTradeInputAction('USD'), wrapWithTradeErrorHandler(sfoxTradeActorInputUsd))
    yield takeLatest(AT.createTradeInputAction('BTC'), wrapWithTradeErrorHandler(sfoxTradeActorInputBtc))
    yield takeLatest(AT.SUBMIT_TRADE, sfoxSubmitTrade)
    yield takeLatest(AT.FETCH_BARE_QUOTE, fetchBareQuote)
    yield takeLatest(buySellAT.FETCH_METADATA_BUYSELL_SUCCESS, init)
    yield takeLatest(AT.FETCH_ACCOUNTS, fetchAccounts)
    yield takeLatest(AT.FETCH_PROFILE, fetchProfile)
    yield takeLatest(AT.HANDLE_TRADE, handleTrade)
    yield takeLatest(AT.FETCH_TRADES, fetchTrades)
    yield takeLatest(AT.FETCH_QUOTE, fetchQuote)
    yield takeLatest(AT.GET_BANK_ACCOUNTS, getBankAccounts)
    yield takeLatest(AT.RESET_PROFILE, resetProfile)
    yield takeLatest(AT.SIGNUP, signup)
  }
}
