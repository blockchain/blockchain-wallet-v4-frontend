import { fork } from 'redux-saga/effects'
import webSocket from './webSocket/sagaRegister'

export default ({ api, ratesSocket, socketd }) =>
  function * middlewareSaga () {
    yield fork(webSocket({ api, ratesSocket, socketd }))
  }
