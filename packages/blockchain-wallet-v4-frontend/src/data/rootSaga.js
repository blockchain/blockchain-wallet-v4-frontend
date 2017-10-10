import { fork } from 'redux-saga/effects'

import config from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import alerts from './Alerts/sagas.js'
import auth from './Auth/sagas.js'
import data from './Data/sagas.js'
import payment from './Payment/sagas.js'
import settings from './Settings/sagas.js'
import wallet from './Wallet/sagas.js'
import walletOptions from './WalletOptions/sagas.js'

const dataPath = config.BLOCKCHAIN_DATA_PATH
const settingsPath = config.SETTINGS_PATH
const walletPath = config.WALLET_IMMUTABLE_PATH

export const sagas = {
  core: coreSagasFactory({
    api,
    dataPath,
    walletPath,
    settingsPath,
    socket
  })
}

const rootSaga = function * () {
  yield [
    fork(alerts),
    fork(auth),
    fork(data),
    fork(payment),
    fork(settings),
    fork(wallet),
    fork(walletOptions),
    fork(sagas.core.webSocket)
  ]
}

export default rootSaga
