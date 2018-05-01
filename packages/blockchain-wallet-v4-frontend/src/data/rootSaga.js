import { all, call, fork } from 'redux-saga/effects'
import { coreSagasFactory, coreRootSagaFactory } from 'blockchain-wallet-v4/src'
import websocketBitcoinFactory from 'blockchain-wallet-v4/src/redux/webSocket/bitcoin/sagas'
import refreshFactory from 'blockchain-wallet-v4/src/redux/refresh/sagas'
import alerts from './alerts/sagas'
import auth from './auth/sagas'
import components from './components/rootSaga'
import modules from './modules/sagas'
import goals from './goals/sagas'
import wallet from './wallet/sagas'

const welcomeSaga = function * () {
  if (console) {
    const version = APP_VERSION
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

export default function * ({ api, socket, options }) {
  const coreSagas = coreSagasFactory({ api, socket })

  yield all([
    call(welcomeSaga),
    fork(alerts),
    fork(auth({ api, coreSagas })),
    fork(components({ api, coreSagas })),
    fork(modules({ coreSagas })),
    fork(goals({ coreSagas })),
    fork(wallet({ coreSagas })),
    fork(websocketBitcoinFactory({ api, socket })),
    fork(refreshFactory()),
    fork(coreRootSagaFactory({ api, socket, options }))
  ])
}
