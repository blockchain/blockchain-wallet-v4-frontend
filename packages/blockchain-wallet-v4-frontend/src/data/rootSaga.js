import { all, call, fork } from 'redux-saga/effects'

import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { sfoxService } from 'services/SfoxService'
import { coinifyService } from 'services/CoinifyService'
import { coreSagasFactory, rootSaga } from 'blockchain-wallet-v4/src'
import alerts from './alerts/sagas'
import auth from './auth/sagas'
import modules from './modules/sagas'
import goals from './goals/sagas'
import wallet from './wallet/sagas'

export const sagas = { core: coreSagasFactory({ api, socket, sfoxService, coinifyService }) }
const coreRootSaga = rootSaga({ api, socket, sfoxService, coinifyService })

const logAppConfigSaga = function * () {
  if (console && process.env.ENV) {
    console.log('=======================================================')
    console.log('APP CONFIGURATION')
    console.log('VERSION: 4.0')
    console.log(`ENVIRONMENT: ${process.env.ENV}`)
    console.log(`BLOCKCHAIN_INFO: ${process.env.BLOCKCHAIN_INFO}`)
    console.log(`API_BLOCKCHAIN_INFO: ${process.env.API_BLOCKCHAIN_INFO}`)
    console.log(`WEB_SOCKET_URL: ${process.env.WEB_SOCKET_URL}`)
    console.log('=======================================================')
  } else {
    console.error('WARNING: Application was potentially loaded without environment configurations!')
  }
  yield
}

const userWarningSaga = function * () {
  if (console) {
    const style1 = 'background: #F00; color: #FFF; font-size: 24px;'
    const style2 = 'font-size: 18px;'
    console.log('%c STOP!!', style1)
    console.log('%c This browser feature is intended for developers.', style2)
    console.log('%c If someone told you to copy-paste something here,', style2)
    console.log('%c it is a scam and will give them access to your money!', style2)
  }
  yield
}

export default function * () {
  yield all([
    call(logAppConfigSaga),
    call(userWarningSaga),
    fork(alerts),
    fork(auth),
    fork(modules),
    fork(goals),
    fork(wallet),
    fork(sagas.core.webSocket.bitcoin),
    fork(sagas.core.refresh),
    fork(coreRootSaga)
  ])
}
