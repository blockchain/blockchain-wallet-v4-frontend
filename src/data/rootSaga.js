import {takeEvery, takeLatest} from 'redux-saga'
import { fork } from 'redux-saga/effects'

import settings from 'config'
import { api } from 'services/walletApi.js'

import { coreSagas } from 'dream-wallet/lib'
import authSagas from './Auth/sagas.js'
import activitySagas from './Activity/sagas.js'
import { handleTimer } from './Alerts/sagas.js'
import { actionTypes } from 'data'

const dataPath = settings.BLOCKCHAIN_DATA_PATH
const settingsPath = settings.SETTINGS_PATH
const walletPath = settings.WALLET_IMMUTABLE_PATH

function * sagas () {
  yield [
    // here you can put an array of sagas in forks
    fork(coreSagas.rootSaga({api, dataPath, walletPath, settingsPath}))
  ]
  yield takeEvery(actionTypes.auth.LOGIN_START, authSagas.login)
  yield takeEvery(actionTypes.core.wallet.CREATE_TREZOR_WALLET_SUCCESS, authSagas.trezor)
  yield takeEvery(actionTypes.core.wallet.CREATE_TREZOR_WALLET_ERROR, authSagas.trezorFailed)
  yield takeLatest(actionTypes.activity.FETCH_ACTIVITIES, activitySagas.fetchActivities)
  yield takeEvery(actionTypes.alerts.ALERTS_SHOW, handleTimer)
}

export default sagas
