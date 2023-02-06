import { fork } from 'redux-saga/effects'

import webSocket from './webSocket/sagaRegister'

export default ({ activitiesSocket, api, coinsSocket, ratesSocket }) =>
  function* middlewareSaga() {
    yield fork(webSocket({ activitiesSocket, api, coinsSocket, ratesSocket }))
  }
