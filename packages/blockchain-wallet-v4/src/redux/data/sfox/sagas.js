import { apply, fork, call, put, select, take } from 'redux-saga/effects'
import { path, prepend } from 'ramda'

import ExchangeDelegate from '../../../exchange/delegate'
import * as S from './selectors'
import * as A from './actions'
import * as AT from './actionTypes'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import * as buySellA from '../../kvStore/buySell/actions'
import { sfoxService } from '../../../exchange/service'
import * as walletActions from '../../wallet/actions'
import settingsSagaFactory from '../../settings/sagas'

let sfox

export default ({ api, options }) => {
  const settingsSagas = settingsSagaFactory({ api })
  const refreshSFOX = function * () {
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api, 'sfox')
    const value = yield select(buySellSelectors.getMetadata)
    const walletOptions = state.walletOptionsPath.data
    sfox = sfoxService.refresh(value, delegate, walletOptions)
  }

  const init = function * () {
    try {
      const value = yield select(buySellSelectors.getMetadata)
      if (!path(['data', 'value', 'sfox', 'account_token'], value)) return
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

  const refetchProfile = function * () {
    const profile = yield apply(sfox, sfox.fetchProfile)
    yield put(A.fetchProfileSuccess(profile))
  }

  const fetchQuote = function * (data) {
    try {
      yield put(A.fetchQuoteLoading())
      const nextAddress = data.payload.nextAddress
      yield put(A.setNextAddress(nextAddress))
      yield call(refreshSFOX)
      const { amt, baseCurrency, quoteCurrency } = data.payload.quote
      const quote = yield apply(sfox, sfox.getBuyQuote, [
        amt,
        baseCurrency,
        quoteCurrency
      ])
      yield put(A.fetchQuoteSuccess(quote))
      yield fork(waitForRefreshQuote, data.payload)
    } catch (e) {
      yield put(A.fetchQuoteFailure(e))
    }
  }

  const fetchSellQuote = function * (data) {
    try {
      yield put(A.fetchSellQuoteLoading())
      yield call(refreshSFOX)
      const { amt, baseCurrency, quoteCurrency } = data.payload.quote
      const quote = yield apply(sfox, sfox.getSellQuote, [
        amt,
        baseCurrency,
        quoteCurrency
      ])
      yield put(A.fetchSellQuoteSuccess(quote))
      yield fork(waitForRefreshSellQuote, data.payload)
    } catch (e) {
      yield put(A.fetchSellQuoteFailure(e))
    }
  }

  const waitForRefreshQuote = function * (quotePayload) {
    yield take(AT.REFRESH_QUOTE)
    yield put(A.fetchQuote(quotePayload))
  }

  const waitForRefreshSellQuote = function * (sellQuotePayload) {
    yield take(AT.REFRESH_SELL_QUOTE)
    yield put(A.fetchSellQuote(sellQuotePayload))
  }

  const fetchTrades = function * () {
    try {
      yield put(A.fetchTradesLoading())

      const kvTrades = yield select(buySellSelectors.getSfoxTrades)
      const numberOfTrades = kvTrades.getOrElse([]).length
      const trades = yield apply(sfox, sfox.getTrades, [numberOfTrades])
      yield put(A.fetchTradesSuccess(trades))
    } catch (e) {
      yield put(A.fetchTradesFailure(e))
    }
  }

  const fetchSfoxAccounts = function * () {
    try {
      yield call(refreshSFOX)
      yield put(A.fetchSfoxAccountsLoading())
      const methods = yield apply(sfox, sfox.getBuyMethods)
      const accounts = yield apply(sfox, methods.ach.getAccounts)
      yield put(A.fetchSfoxAccountsSuccess(accounts))
    } catch (e) {
      yield put(A.fetchSfoxAccountsFailure(e))
    }
  }

  const getBankAccounts = function * (data) {
    const token = data.payload
    try {
      const bankAccounts = yield apply(
        sfox.bankLink,
        sfox.bankLink.getAccounts,
        [token]
      )
      yield put(A.getBankAccountsSuccess(bankAccounts))
    } catch (e) {
      yield put(A.getBankAccountsFailure(e))
    }
  }

  const resetProfile = function * () {
    yield put(A.resetProfile())
  }

  const getSfox = function * () {
    try {
      const state = yield select()
      const delegate = new ExchangeDelegate(state, api, 'sfox')
      const value = yield select(buySellSelectors.getMetadata)
      const walletOptions = state.walletOptionsPath.data
      const sfox = sfoxService.refresh(value, delegate, walletOptions)
      return sfox
    } catch (error) {
      console.warn(error)
    }
  }

  const setBankManually = function * (data) {
    const { routing, account, name, type } = data
    try {
      yield put(A.setBankManuallyLoading())
      const sfox = yield call(getSfox)
      const methods = yield apply(sfox, sfox.getBuyMethods)
      const addedBankAccount = yield apply(
        methods.ach,
        methods.ach.addAccount,
        [routing, account, name, type]
      )
      yield put(A.setBankManuallySuccess(addedBankAccount))
      yield call(fetchSfoxAccounts)
      return addedBankAccount
    } catch (e) {
      yield put(A.setBankManuallyFailure(e))
      yield put(A.setBankAccountFailure(e))
      return e
    }
  }

  const signup = function * () {
    try {
      const sfox = yield call(getSfox)
      const signupResponse = yield apply(sfox, sfox.signup)

      yield put(buySellA.sfoxSetProfileBuySell(signupResponse))
      yield put(A.setToken(signupResponse))
      yield put(A.signupSuccess(signupResponse))
    } catch (e) {
      yield put(A.signupFailure(e))
    }
  }

  const setProfile = function * (user) {
    const {
      firstName,
      lastName,
      dob,
      address1,
      address2,
      city,
      ssn,
      state,
      zipcode
    } = user.payload
    const sfox = yield call(getSfox)
    yield apply(sfox, sfox.fetchProfile)
    try {
      sfox.profile.firstName = firstName
      sfox.profile.lastName = lastName
      sfox.profile.dateOfBirth = new Date(dob)
      sfox.profile.setSSN(ssn)
      sfox.profile.setAddress(address1, address2, city, state.code, zipcode)
      yield apply(sfox.profile, sfox.profile.verify)
      yield put(A.setProfileSuccess(sfox.profile))
    } catch (e) {
      yield put(A.setProfileFailure(e))
    }
  }

  const uploadDoc = function * (data) {
    const { idType, file } = data.payload
    try {
      const sfox = yield call(getSfox)
      const profileR = yield select(S.getProfile)
      const profile = profileR.getOrFail('No Profile found')
      const sfoxUrl = yield apply(profile, profile.getSignedURL, [
        idType,
        file.name
      ])

      yield call(api.uploadVerificationDocument, sfoxUrl.signed_url, file)

      const profileAfterUpload = yield apply(sfox, sfox.fetchProfile)
      yield put(A.fetchProfileSuccess(profileAfterUpload))
    } catch (e) {
      yield put(A.uploadFailure(e))
    }
  }

  const setBankAccount = function * (data) {
    const bank = data.payload
    try {
      const sfox = yield call(getSfox)
      yield apply(sfox.bankLink, sfox.bankLink.setAccount, [bank])

      const methods = yield apply(sfox, sfox.getBuyMethods)
      const accounts = yield apply(sfox, methods.ach.getAccounts)
      yield put(A.fetchSfoxAccountsSuccess(accounts))
      return accounts
    } catch (e) {
      yield put(A.fetchSfoxAccountsFailure(e))
    }
  }

  const verifyMicroDeposits = function * (data) {
    const { amount1, amount2 } = data.payload
    try {
      const accountsR = yield select(S.getAccounts)
      const accounts = accountsR.getOrElse([])
      const response = yield apply(accounts[0], accounts[0].verify, [
        amount1,
        amount2
      ])
      yield call(fetchSfoxAccounts)
      return response
    } catch (e) {
      console.warn(e)
      return e
    }
  }

  const handleTrade = function * (quote, addressData) {
    try {
      yield put(A.handleTradeLoading())
      const accountsR = yield select(S.getAccounts)
      const accounts = accountsR.getOrElse([])
      const methods = yield apply(quote, quote.getPaymentMediums)
      const trade = yield apply(methods.ach, methods.ach.buy, [accounts[0]])
      yield put(A.handleTradeSuccess(trade))
      yield put(A.fetchProfile())
      yield put(A.fetchTrades())
      yield call(settingsSagas.setLastTxTime)
      // save trades to metadata
      const kvTrades = yield select(buySellSelectors.getSfoxTrades)
      const newTrades = prepend(trade, kvTrades.getOrElse([]))
      yield put(buySellA.setSfoxTradesBuySell(newTrades))

      yield call(labelAddressForBuy, trade, addressData)
      return trade
    } catch (e) {
      console.warn(e)
      yield put(A.handleTradeFailure(e))
      return e
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
          `SFOX order #${id}`
        )
      )
    } catch (e) {
      console.warn('err in labelAddressForBuy', e)
      yield put(A.handleTradeFailure(e))
    }
  }

  const handleSellTrade = function * (quote) {
    try {
      yield put(A.handleTradeLoading())
      const accountsR = yield select(S.getAccounts)
      const accounts = accountsR.getOrElse([])
      const methods = yield apply(quote, quote.getPaymentMediums)
      const trade = yield apply(methods.ach, methods.ach.sell, [accounts[0]])
      yield put(A.handleTradeSuccess(trade))
      yield put(A.fetchProfile())
      yield put(A.fetchTrades())

      // get current kvstore trades, add new trade and set new trades to metadata
      const kvTrades = yield select(buySellSelectors.getSfoxTrades)
      const newTrades = prepend(trade, kvTrades.getOrElse([]))
      yield put(buySellA.setSfoxTradesBuySell(newTrades))

      return trade
    } catch (e) {
      console.log(e)
      yield put(A.handleTradeFailure(e))
    }
  }

  return {
    init,
    fetchSfoxAccounts,
    fetchProfile,
    fetchTrades,
    fetchQuote,
    fetchSellQuote,
    getBankAccounts,
    resetProfile,
    setBankManually,
    signup,
    setProfile,
    uploadDoc,
    setBankAccount,
    verifyMicroDeposits,
    handleTrade,
    handleSellTrade,
    labelAddressForBuy,
    refetchProfile
  }
}
