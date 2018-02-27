import delegate from '../../../../../../../blockchain-wallet-v4-frontend/src/services/ExchangeDelegate'
import { apply, put, select, takeLatest } from 'redux-saga/effects'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import * as buySellAT from '../../kvStore/buySell/actionTypes'
import SFOX from 'bitcoin-sfox-client'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as A from './actions'
let sfox

export default ({ api } = {}) => {
  const init = function * () {
    try {
      const value = yield select(buySellSelectors.getMetadata)
      sfox = new SFOX(value.data.value.sfox, delegate)
      sfox.api.production = true
      sfox.api.apiKey = 'f31614a7-5074-49f2-8c2a-bfb8e55de2bd'
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
      const { amt, baseCurr, quoteCurr } = data.payload
      const quote = yield apply(sfox, sfox.getBuyQuote, [amt, baseCurr, quoteCurr])
      yield put(A.fetchQuoteSuccess(quote))
    } catch (e) {
      yield put(A.fetchQuoteFailure(e))
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
    } catch (e) {
      yield put(A.handleTradeFailure(e))
    }
  }

  const setProfile = function * (data) {
    const { firstName, lastName, middleName, dob, address1, address2, city, ssn, state, zipcode } = data.payload
    try {
      sfox.profile.firstName = firstName
      sfox.profile.middleName = middleName || ''
      sfox.profile.lastName = lastName
      sfox.profile.dateOfBirth = new Date(dob)
      sfox.profile.setSSN(ssn)
      sfox.profile.setAddress(
        address1,
        address2,
        city,
        state,
        zipcode
      )
      const verify = yield apply(sfox.profile, sfox.profile.verify)
      console.log('after verify', verify)
      yield put(A.setProfileSuccess())
    } catch (e) {
      console.warn('setProfile saga', e)
      yield put(A.setProfileFailure(e))
    }
  }

  return function * () {
    yield takeLatest(buySellAT.FETCH_METADATA_BUYSELL_SUCCESS, init)
    yield takeLatest(AT.FETCH_ACCOUNTS, fetchAccounts)
    yield takeLatest(AT.FETCH_PROFILE, fetchProfile)
    yield takeLatest(AT.HANDLE_TRADE, handleTrade)
    yield takeLatest(AT.FETCH_QUOTE, fetchQuote)
    yield takeLatest(AT.SET_PROFILE, setProfile)
  }
}
