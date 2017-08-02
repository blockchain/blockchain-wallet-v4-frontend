import { takeEvery, takeLatest, fork } from 'redux-saga/effects'

import settings from 'config'
import { api } from 'services/ApiService'

import { coreSagas } from 'dream-wallet/lib'
import authSagas from './Auth/sagas.js'
import activitySagas from './Activity/sagas.js'
import { handleTimer } from './Alerts/sagas.js'
import { handleSend } from './Send/sagas.js'
import { actionTypes } from 'data'
import { readQrAndAlert } from './Modals/sagas.js'

const dataPath = settings.BLOCKCHAIN_DATA_PATH
const settingsPath = settings.SETTINGS_PATH
const walletPath = settings.WALLET_IMMUTABLE_PATH

function * sagas () {
  yield [
    fork(coreSagas.rootSaga({api, dataPath, walletPath, settingsPath}))
  ]
  yield takeEvery(actionTypes.auth.LOGIN_START, authSagas.login)
  yield takeEvery(actionTypes.core.wallet.CREATE_TREZOR_WALLET_SUCCESS, authSagas.trezor)
  yield takeEvery(actionTypes.core.wallet.CREATE_TREZOR_WALLET_ERROR, authSagas.trezorFailed)
  yield takeEvery(actionTypes.core.payment.SIGN_AND_PUBLISH_SUCCESS, handleSend)
  yield takeLatest(actionTypes.activity.FETCH_ACTIVITIES, activitySagas.fetchActivities)
  yield takeEvery(actionTypes.alerts.ALERTS_SHOW, handleTimer)
  yield takeEvery('READ', readQrAndAlert)
}

export default sagas
