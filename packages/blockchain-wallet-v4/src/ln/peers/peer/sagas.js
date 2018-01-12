import {SOCKET_OPENED} from "../../tcprelay/actionTypes";

export const peerSagas = (tcpConn) => {
  const connect = function * (action) {
    yield call()
     // TODO use tcpConn to connect, wait for callback and then go through full handshake, then fire another event again
  }

  return function * () {
    yield takeEvery(SOCKET_OPENED, connect)
  }
}
