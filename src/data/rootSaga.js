import { fork } from 'redux-saga/effects'

import settings from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'

import { coreSagas } from 'blockchain-wallet-v4/lib'
import alertSagas from './Alerts/sagas.js'
import authSagas from './Auth/sagas.js'
import interactivitySagas from './Interactivity/sagas.js'

const dataPath = settings.BLOCKCHAIN_DATA_PATH
const settingsPath = settings.SETTINGS_PATH
const walletPath = settings.WALLET_IMMUTABLE_PATH

function * sagas () {
  yield [
    fork(coreSagas.rootSaga({ api, dataPath, walletPath, settingsPath, socket })),
    fork(alertSagas),
    fork(authSagas),
    fork(interactivitySagas)
  ]
  // yield takeEvery(actionTypes.core.payment.SIGN_AND_PUBLISH_SUCCESS, handleSend)
}

export default sagas
