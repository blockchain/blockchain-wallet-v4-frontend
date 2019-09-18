import { fork } from 'redux-saga/effects'
import xlm from './xlm/sagaRegister'
import rates from './rates/sagaRegister'
import sds from './socketd/sagaRegister'

export default ({ api, ratesSocket, socketd }) =>
  function * webSocketSaga () {
    yield fork(xlm())
    yield fork(rates({ api, ratesSocket }))
    yield fork(sds({ api, socketd }))
  }
