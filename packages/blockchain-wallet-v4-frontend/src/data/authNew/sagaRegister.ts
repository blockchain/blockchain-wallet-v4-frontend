import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const authNewSagas = sagas({ api, coreSagas })

  return function* authSaga() {
    yield takeLatest(AT.INTIALIZE_LOGIN, authNewSagas.initializeLogin)
    yield takeLatest(AT.LOGIN_GUID, authNewSagas.loginGuid)
    yield takeLatest(AT.GUID_WALLET, authNewSagas.submitWalletGuid)
  }
}
