
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import readBlob from 'read-blob'
import { delayAjax } from '../../paths'
import * as AT from './actionTypes'
import * as A from './actions'
import * as selectors from '../../selectors'
import * as sagas from '../../settings/sagas'

export default ({ api } = {}) => {
  const fetchAdverts = function * (action) {
    try {
      const { number } = action.payload
      yield put(A.fetchAdvertsLoading())
      const data = yield call(api.getAdverts, number)
      yield call(delay, delayAjax)
      yield put(A.fetchAdvertsSuccess(data))
    } catch (e) {
      yield put(A.fetchAdvertsFailure(e.message))
    }
  }

  const fetchCaptcha = function * () {
    try {
      const timestamp = new Date().getTime()
      const sessionToken = yield call(api.obtainSessionToken)
      yield put(A.fetchCaptchaLoading())
      const data = yield call(api.getCaptchaImage, timestamp, sessionToken)
      const url = yield call(readBlob, data, 'dataurl')
      yield call(delay, delayAjax)
      yield put(A.fetchCaptchaSuccess({ url, sessionToken }))
    } catch (e) {
      yield put(A.fetchCaptchaFailure(e.message))
    }
  }

  const fetchPriceIndexSeries = function * (action) {
    try {
      const { coin, currency, start, scale } = action.payload
      yield put(A.fetchPriceIndexSeriesLoading())
      const data = yield call(api.getPriceIndexSeries, coin, currency, start, scale)
      yield call(delay, delayAjax)
      yield put(A.fetchPriceIndexSeriesSuccess(data))
    } catch (e) {
      yield put(A.fetchPriceIndexSeriesFailure(e.message))
    }
  }

  const fetchLogs = function * ({ address }) {
    try {
      const guid = yield select(selectors.wallet.getGuid)
      const sharedKey = yield select(selectors.wallet.getSharedKey)
      yield put(A.fetchLogsLoading())
      const data = yield call(api.getLogs, guid, sharedKey)
      yield call(delay, delayAjax)
      yield put(A.fetchLogsSuccess(data.results))
    } catch (e) {
      yield put(A.fetchLogsFailure(e.message))
    }
  }

  const encodePairingCode = function * () {
    try {
      yield put(A.encodePairingCodeLoading())
      const encryptionPhrase = yield call(sagas.settingsSaga({api: api}).encodePairingCode)
      yield put(A.encodePairingCodeSuccess(encryptionPhrase))
    } catch (e) {
      yield put(A.encodePairingCodeFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_ADVERTS, fetchAdverts)
    yield takeLatest(AT.FETCH_CAPTCHA, fetchCaptcha)
    yield takeLatest(AT.FETCH_LOGS, fetchLogs)
    yield takeLatest(AT.FETCH_PRICE_INDEX_SERIES, fetchPriceIndexSeries)
    yield takeLatest(AT.ENCODE_PAIRING_CODE, encodePairingCode)
  }
}
