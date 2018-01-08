export const peerSagas = (tcpConn) => {
  const connect = function * (action) {
     // TODO use tcpConn to connect, wait for callback and then go through full handshake, then fire another event again
  }

  // TODO how do we wire up the sagas?
}
