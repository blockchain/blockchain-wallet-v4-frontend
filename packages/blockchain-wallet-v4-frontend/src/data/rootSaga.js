import { all, fork } from 'redux-saga/effects'

import config from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import alerts from './alerts/sagas.js'
import auth from './auth/sagas.js'
import data from './data/sagas.js'
import goals from './goals/sagas.js'
import payment from './payment/sagas.js'
import settings from './settings/sagas.js'
import wallet from './wallet/sagas.js'

const dataPath = config.WALLET_DATA_PATH
const settingsPath = config.WALLET_SETTINGS_PATH
const walletPath = config.WALLET_PAYLOAD_PATH
const kvStorePath = config.WALLET_KVSTORE_PATH

console.log(payment)

export const sagas = {
  core: coreSagasFactory({
    api,
    dataPath,
    walletPath,
    settingsPath,
    kvStorePath,
    socket
  })
}

const rootSaga = function * () {
  yield all([
    fork(alerts),
    fork(auth),
    fork(data),
    fork(goals),
    fork(payment),
    fork(settings),
    fork(wallet),
    fork(sagas.core.webSocket)
  ])
}

export default rootSaga
