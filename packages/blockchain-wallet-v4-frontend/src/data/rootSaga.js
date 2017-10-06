import { fork } from 'redux-saga/effects'

import settings from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagas } from 'blockchain-wallet-v4/src'
import alertSagas from './Alerts/sagas.js'
import authSagas from './Auth/sagas.js'
import modalSagas from './Modals/sagas.js'
import settingsSaga from './Settings/sagas.js'
import interactivitySagas from './Interactivity/sagas.js'
import walletSagas from './Wallet/sagas.js'

const dataPath = settings.BLOCKCHAIN_DATA_PATH
const settingsPath = settings.SETTINGS_PATH
const walletPath = settings.WALLET_IMMUTABLE_PATH

function * sagas () {
  yield [
    fork(coreSagas.rootSaga({ api, dataPath, walletPath, settingsPath, socket })),
    fork(alertSagas),
    fork(authSagas),
    fork(modalSagas),
    fork(settingsSaga)
    fork(interactivitySagas),
    fork(walletSagas)
  ]
}

export default sagas
