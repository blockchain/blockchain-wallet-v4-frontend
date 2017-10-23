import { call, put } from 'redux-saga/effects'
import readBlob from 'read-blob'
import * as A from './actions'

export const captcha = ({ api } = {}) => {
  const fetchCaptcha = function * () {
    const timestamp = new Date().getTime()
    const sessionToken = yield call(api.obtainSessionToken)
    const response = yield call(api.getCaptchaImage, timestamp, sessionToken)
    const url = yield call(readBlob, response, 'dataurl')
    yield put(A.setCaptcha(url, sessionToken))
  }

  return {
    fetchCaptcha
  }
}
