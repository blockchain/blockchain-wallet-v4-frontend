import { fork } from 'redux-saga/effects'
import coins from './coins/sagaRegister'
import rates from './rates/sagaRegister'
import xlm from './xlm/sagaRegister'

export default ({ api, ratesSocket, coinsSocket }) =>
  function * webSocketSaga () {
    yield fork(xlm())
    yield fork(rates({ api, ratesSocket }))
    yield fork(coins({ api, coinsSocket }))
  }
