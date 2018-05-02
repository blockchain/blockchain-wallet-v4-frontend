import { call, put, select } from 'redux-saga/effects'
import readBlob from 'read-blob'
import * as A from './actions'
import * as selectors from '../../selectors'
import * as wS from '../../wallet/selectors'
import * as pairing from '../../../pairing'

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
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
      const encryptionPhrase = yield call(() =>
        taskToPromise(pairing.encode(guid, sharedKey, password, pairingPassword)))
      yield put(A.encodePairingCodeSuccess(encryptionPhrase))
    } catch (e) {
      yield put(A.encodePairingCodeFailure(e.message || e))
    }
  }

  const authorizeLogin = function * (action) {
    const { token, confirm } = action.payload
    try {
      yield put(A.authorizeLoginLoading())
      const data = yield call(api.authorizeLogin, token, confirm)
      if (data.success || data.device_change_reason) {
        yield put(A.authorizeLoginSuccess(data))
      } else {
        yield put(A.authorizeLoginFailure(data.error))
      }
    } catch (e) {
      yield put(A.authorizeLoginFailure(e.message || e.error))
    }
  }

  const handle2FAReset = function * (action) {
    const { token } = action.payload
    try {
      yield put(A.handle2FAResetLoading())
      const data = yield call(api.handle2faReset, token)
      if (data.success) {
        yield put(A.handle2FAResetSuccess(data))
      } else {
        yield put(A.handle2FAResetFailure(data.error))
      }
    } catch (e) {
      yield put(A.handle2FAResetFailure(e.message || e.error))
    }
  }

  const verifyEmailToken = function * (action) {
    const { token } = action.payload
    try {
      yield put(A.verifyEmailTokenLoading())
      const data = yield call(api.verifyEmailToken, token)
      if (data.success) {
        yield put(A.verifyEmailTokenSuccess(data))
      } else {
        yield put(A.verifyEmailTokenFailure(data.error))
      }
    } catch (e) {
      yield put(A.handle2FAResetFailure(e.message || e.error))
    }
  }

  return {
    authorizeLogin,
    fetchCaptcha,
    fetchLogs,
    fetchPriceIndexSeries,
    encodePairingCode,
    verifyEmailToken,
    handle2FAReset
  }
}
