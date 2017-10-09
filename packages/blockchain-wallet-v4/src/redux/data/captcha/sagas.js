import { takeEvery, call, put } from 'redux-saga/effects'
import readBlob from 'read-blob'
import * as A from './actions'
import * as AT from './actionTypes'

export const captchaSaga = ({ api } = {}) => {
  const fetchCaptcha = function * (action) {
    try {
      const timestamp = new Date().getTime()
      const sessionToken = yield call(api.obtainSessionToken)
      const response = yield call(api.getCaptchaImage, timestamp, sessionToken)
      const url = yield call(readBlob, response, 'dataurl')
      yield put(A.fetchCaptchaSuccess({ url, sessionToken }))
    } catch (error) {
      yield put(A.fetchCaptchaError(error))
    }
  }

  return function * () {
    yield takeEvery(AT.FETCH_CAPTCHA, fetchCaptcha)
  }
}
