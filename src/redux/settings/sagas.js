import { takeEvery, call, put } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'
import { selectors } from '../selectors'

export const settingsSaga = ({ api } = {}) => {
  const fetchSettings = function * (action) {
    const { guid, sharedKey } = action.payload
    try {
      let response = yield call(api.getSettings, guid, sharedKey)
      yield put(A.fetchSettingsSuccess(response))
    } catch (error) {
      yield put(A.fetchSettingsError(error))
    }
  }

  const requestPairingCode = function * (action) {
    try {
      // Get guid, sharedKey, password and PAIRING_CODE_PBKDF2_ITERATIONS
      const guid = ''
      const sharedKey = ''
      const password = ''
      const iterations = ''
      let response = yield call(api.getPairingCode, guid, sharedKey)
      // TODO /!\ : Convert to right format : https://github.com/blockchain/My-Wallet-V3/blob/master/src/wallet.js#L187
      yield put(A.requestPairingCodeSuccess(response))
    } catch (error) {
      yield put(A.requestPairingCodeError(error))
    }
  }

  return function * () {
    yield takeEvery(T.FETCH_SETTINGS, fetchSettings)
    yield takeEvery(T.REQUEST_PAIRING_CODE, requestPairingCode)
  }
}
