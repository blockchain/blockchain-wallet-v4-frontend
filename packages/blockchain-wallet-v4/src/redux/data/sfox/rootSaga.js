import { apply, put, select, takeLatest } from 'redux-saga/effects'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import * as buySellAT from '../../kvStore/buySell/actionTypes'
import * as delegate from '../../../exchange/delegate'
import SFOX from 'bitcoin-sfox-client'
import * as AT from './actionTypes'
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

  return function * () {
    yield takeLatest(buySellAT.FETCH_METADATA_BUYSELL_SUCCESS, init)
    yield takeLatest(AT.FETCH_PROFILE, fetchProfile)
    yield takeLatest(AT.FETCH_QUOTE, fetchQuote)
  }
}
