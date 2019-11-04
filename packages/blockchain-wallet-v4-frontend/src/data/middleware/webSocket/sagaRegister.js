import { fork } from 'redux-saga/effects'
import xlm from './xlm/sagaRegister'
import rates from './rates/sagaRegister'
import coins from './coins/sagaRegister'

export default ({ api, ratesSocket, coinsSocket }) =>
  function * webSocketSaga () {
    yield fork(xlm())
    yield fork(rates({ api, ratesSocket }))
    yield fork(coins({ api, coinsSocket }))
  }
