import {SOCKET_OPENED} from '../tcprelay/actionTypes'
import { CONNECT, DISCONNECT, SEND_MESSAGE } from './actionTypes'
import { takeEvery} from 'redux-saga'
import { peerStaticRemote } from './selectors'
import { call, put, select } from 'redux-saga/effects'
import * as Long from 'long'
import * as random from 'crypto'
import {Connection} from './connection'
import { wrapPubKey } from '../channel/channel'

var ec = require('bcoin/lib/crypto/secp256k1-browser')

export const peerSagas = (tcpConn) => {

  let options = {
    chainHash: Buffer.from('06226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f', 'hex'),
    dustLimitSatoshis: Long.fromNumber(546),
    maxHtlcValueInFlightMsat: Long.fromNumber(100000),
    channelReserveSatoshis: Long.fromNumber(1000),
    feeRatePerKw: 10000,
    htlcMinimumMsat: 1,
    toSelfDelay: 60,
    maxAcceptedHtlcs: 100
  }

  let peers = {}

  const connectToAllPeers = function * (action) {
    console.log('socket opened')
    console.log(action)
    let staticRemotes = yield select(peerStaticRemote)

    for (let staticRemoteString in staticRemotes) {
      let staticRemote = wrapPubKey(Buffer.from(staticRemoteString, 'hex'))
      //console.log(options)
      let peer = new Connection(options, staticRemote)
      peers[staticRemoteString] = peer
      yield call(connect, {type: CONNECT, publicKey: staticRemoteString})
    }
    // TODO use tcpConn to connect, wait for callback and then go through full handshake, then fire another event again
  }

  const connect = function * (action) {
    console.log('connect')
    let {type, publicKey} = action
    // console.log(type)
    // console.log(publicKey)
    let peer = peers[publicKey]

    //let handshakeCb = (state) => peer.createPaymentChannel(state, 100000)
    // undefined for state holder
    yield call(peer.connectPromise.bind(peer), tcpConn)
  }

  const disconnect = function * (action) {
  }

  const sendMessage = function * (action) {
  }

  const takeSagas = function * () {
    console.log('creating saga')
    let staticLocal = {}
    staticLocal.priv = random.randomBytes(32)
    staticLocal.pub = ec.publicKeyCreate(staticLocal.priv, true)
    options.staticLocal = staticLocal
    yield takeEvery(SOCKET_OPENED, connectToAllPeers)
    yield takeEvery(CONNECT, connect)
    yield takeEvery(DISCONNECT, disconnect)
    yield takeEvery(SEND_MESSAGE, sendMessage)
  }

  return {
    connectToAllPeers,
    connect,
    disconnect,
    sendMessage,
    takeSagas
  }
}
