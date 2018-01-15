import {Connection} from '../peers/connection'

const tcpRelay = (tcpConn) => {
  let openConnections = {}

  const connect = function * (options, staticRemote) {
    let conn = new Connection(options, staticRemote)

    openConnections[staticRemote] = conn

    yield call(tcpConn.connectToNodePromise, staticRemote)
  }

  const decrypt = function * (staticRemote, msg) {

  }

  const send = function * (staticRemote, msg) {

  }

  return function * {
    yield takeEvery()
  }
}
