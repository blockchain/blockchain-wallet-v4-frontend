
import { call, put, select, takeLatest } from 'redux-saga/effects'
import readBlob from 'read-blob'
import * as AT from './actionTypes'
import * as A from './actions'
import * as selectors from '../../selectors'
import * as wS from '../../wallet/selectors'
import * as pairing from '../../../pairing'

export default ({ api }) => {
  const fetchAdverts = function * (action) {
    try {
      const { number } = action.payload
      yield put(A.fetchAdvertsLoading())
      const data = yield call(api.getAdverts, number)
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
      yield put(A.fetchLogsSuccess(data.results))
    } catch (e) {
      yield put(A.fetchLogsFailure(e.message))
    }
  }

  const encodePairingCode = function * () {
    try {
      yield put(A.encodePairingCodeLoading())
      const guid = yield select(wS.getGuid)
      const sharedKey = yield select(wS.getSharedKey)
      const password = yield select(wS.getMainPassword)
      const pairingPassword = yield call(api.getPairingPassword, guid)
      const encryptionPhrase = pairing.encode(guid, sharedKey, password, pairingPassword)
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
