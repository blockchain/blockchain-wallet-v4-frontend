import { all, call, fork, put } from 'redux-saga/effects'
import { coreSagasFactory, coreRootSagaFactory } from 'blockchain-wallet-v4/src'
import websocketBitcoinFactory from 'blockchain-wallet-v4/src/redux/webSocket/bitcoin/sagaRegister'
import websocketEthereumFactory from 'blockchain-wallet-v4/src/redux/webSocket/ethereum/sagaRegister'
import websocketBchFactory from 'blockchain-wallet-v4/src/redux/webSocket/bch/sagaRegister'
import refreshFactory from 'blockchain-wallet-v4/src/redux/refresh/sagaRegister'
import * as actions from './actions'
import alerts from './alerts/sagaRegister'
import auth from './auth/sagaRegister'
import components from './components/sagaRegister'
import modules from './modules/sagaRegister'
import goals from './goals/sagaRegister'
import wallet from './wallet/sagaRegister'

const welcomeSaga = function * () {
  try {
    const version = APP_VERSION
    const style1 = 'background: #F00; color: #FFF; font-size: 24px;'
    const style2 = 'font-size: 18px;'
    /* eslint-disable */
    console.log('=======================================================')
    console.log(`%c Wallet version ${version}`, style2)
    console.log('=======================================================')
    console.log('%c STOP!!', style1)
    console.log('%c This browser feature is intended for developers.', style2)
    console.log('%c If someone told you to copy-paste something here,', style2)
    console.log('%c it is a scam and will give them access to your money!', style2)
    /* eslint-enable */
  } catch (e) {
    yield put(actions.logs.logErrorMessage('data/rootSaga', 'welcomeSaga', e))
  }
}

export default function * ({ api, btcSocket, ethSocket, bchSocket, options }) {
  const coreSagas = coreSagasFactory({ api })

  yield all([
    call(welcomeSaga),
    fork(alerts),
    fork(auth({ api, coreSagas })),
    fork(components({ api, coreSagas })),
    fork(modules({ coreSagas })),
    fork(goals({ coreSagas })),
    fork(wallet({ coreSagas })),
    fork(websocketBitcoinFactory({ api, btcSocket })),
    fork(websocketEthereumFactory({ api, ethSocket })),
    fork(websocketBchFactory({ api, bchSocket })),
    fork(refreshFactory()),
    fork(coreRootSagaFactory({ api, options }))
  ])
}
