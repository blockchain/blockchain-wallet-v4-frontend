import { fork } from 'redux-saga/effects'

import webSocket from './webSocket/sagaRegister'

export default ({ api, coinsSocket, ratesSocket }) =>
  function * middlewareSaga() {
    yield fork(webSocket({ api, ratesSocket, coinsSocket }))
  }
