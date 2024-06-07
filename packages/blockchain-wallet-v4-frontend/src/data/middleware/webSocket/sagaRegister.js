import { fork } from 'redux-saga/effects'

import coins from './coins/sagaRegister'
import xlm from './xlm/sagaRegister'

export default ({ api, coinsSocket }) =>
  function* webSocketSaga() {
    yield fork(xlm())
    yield fork(coins({ api, coinsSocket }))
  }
