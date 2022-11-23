import { fork } from 'redux-saga/effects'

import activities from './activities/sagaRegister'
import coins from './coins/sagaRegister'
import rates from './rates/sagaRegister'
import xlm from './xlm/sagaRegister'

export default ({ activitiesSocket, api, coinsSocket, ratesSocket }) =>
  function* webSocketSaga() {
    yield fork(xlm())
    yield fork(activities({ activitiesSocket, api }))
    yield fork(rates({ api, ratesSocket }))
    yield fork(coins({ api, coinsSocket }))
  }
