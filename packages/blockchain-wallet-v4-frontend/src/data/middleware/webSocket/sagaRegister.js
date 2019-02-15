import { fork } from 'redux-saga/effects'
import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import eth from './eth/sagaRegister'
import xlm from './xlm/sagaRegister'
import rates from './rates/sagaRegister'

export default ({ api, bchSocket, btcSocket, ethSocket, ratesSocket }) =>
  function* webSocketSaga () {
    yield fork(bch({ api, bchSocket }))
    yield fork(btc({ api, btcSocket }))
    yield fork(eth({ api, ethSocket }))
    yield fork(xlm())
    yield fork(rates({ api, ratesSocket }))
  }
