import { all, call, fork } from 'redux-saga/effects'

import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { sfoxService } from 'services/SfoxService'
import { coinifyService } from 'services/CoinifyService'
import { coreSagasFactory, rootSaga } from 'blockchain-wallet-v4/src'
import alerts from './alerts/sagas'
import auth from './auth/sagas'
import components from './components/sagas'
import modules from './modules/sagas'
import goals from './goals/sagas'
import wallet from './wallet/sagas'

export const sagas = { core: coreSagasFactory({ api, socket, sfoxService, coinifyService }) }
const coreRootSaga = rootSaga({ api, socket, sfoxService, coinifyService })

const welcomeSaga = function * () {
  if (console) {
    const version = '4.0.0.0'
    const style1 = 'background: #F00; color: #FFF; font-size: 24px;'
    const style2 = 'font-size: 18px;'
    console.log('=======================================================')
    console.log(`%c Wallet version ${version}`, style2)
    console.log('=======================================================')
    console.log('%c STOP!!', style1)
    console.log('%c This browser feature is intended for developers.', style2)
    console.log('%c If someone told you to copy-paste something here,', style2)
    console.log('%c it is a scam and will give them access to your money!', style2)
  }
  yield
}

export default function * () {
  yield all([
    call(welcomeSaga),
    fork(alerts),
    fork(auth),
    fork(components),
    fork(modules),
    fork(goals),
    fork(wallet),
    fork(sagas.core.webSocket.bitcoin),
    fork(sagas.core.refresh),
    fork(coreRootSaga)
  ])
}
