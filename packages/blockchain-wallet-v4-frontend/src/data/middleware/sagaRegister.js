import { fork } from 'redux-saga/effects'

import webSocket from './webSocket/sagaRegister'

export default ({ api, coinsSocket }) =>
  function* middlewareSaga() {
    yield fork(webSocket({ api, coinsSocket }))
  }
