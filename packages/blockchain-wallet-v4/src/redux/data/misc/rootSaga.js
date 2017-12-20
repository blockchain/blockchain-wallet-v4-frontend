
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import readBlob from 'read-blob'
import * as AT from './actionTypes'
import * as A from './actions'
import * as selectors from '../../selectors'

export default ({ api } = {}) => {
  const fetchAdverts = function * ({ number }) {
    try {
      const data = yield call(api.getAdverts, number)
      yield call(delay, 2000)
      yield put(A.fetchAdvertsSuccess(data))
    } catch (e) {
      yield put(A.fetchAdvertsFailure(e.message))
      throw e
    }
  }

  const fetchCaptcha = function * () {
    try {
      const timestamp = new Date().getTime()
      const sessionToken = yield call(api.obtainSessionToken)
      const data = yield call(api.getCaptchaImage, timestamp, sessionToken)
      const url = yield call(readBlob, data, 'dataurl')
      yield call(delay, 2000)
      yield put(A.fetchCaptchaSuccess({ url, sessionToken }))
    } catch (e) {
      yield put(A.fetchCaptchaFailure(e.message))
      throw e
    }
  }

  const fetchPriceIndexSeries = function * ({ coin, start, scale }) {
    try {
      const currency = yield select(selectors.settings.getCurrency)
      const data = yield call(api.getPriceIndexSeries, coin, currency, start, scale)
      yield call(delay, 2000)
      yield put(A.fetchPriceIndexSeriesSuccess(data))
    } catch (e) {
      yield put(A.fetchPriceIndexSeriesFailure(e.message))
    }
  }

  const fetchLogs = function * ({ address }) {
    try {
      const guid = yield select(selectors.wallet.getGuid)
      const sharedKey = yield select(selectors.wallet.getSharedKey)
      const data = yield call(api.getLogs, guid, sharedKey)
      yield call(delay, 2000)
      yield put(A.fetchLogsSuccess(data.results))
    } catch (e) {
      yield put(A.fetchLogsFailure(e.message))
      throw e
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_ADVERTS, fetchAdverts)
    yield takeLatest(AT.FETCH_CAPTCHA, fetchCaptcha)
    yield takeLatest(AT.FETCH_LOGS, fetchLogs)
    yield takeLatest(AT.FETCH_PRICE_INDEX_SERIES, fetchPriceIndexSeries)
  }
}
