import {PEER_MESSAGE, SOCKET_OPENED} from '../tcprelay/actionTypes'
import { CONNECT, DISCONNECT, SEND_MESSAGE } from './actionTypes'
import { peerStaticRemote, privateKeyPath} from './selectors'
import { takeEvery, delay} from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import {Connection} from './connection'
import { connected, updateLastPing, initMessageReceived} from './actions'
import { wrapPubKey } from '../channel/channel'
import {readMessage, writeMessage} from '../messages/parser'
import * as AT_CHANNEL from '../channel/actions'
import { rootOptions } from '../root/selectors'

var ec = require('bcoin/lib/crypto/secp256k1-browser')

export const encodePeer = publicKey => publicKey.toString('base64')
export const decodePeer = publicKey => Buffer.from(publicKey, 'base64')

export const peerSagas = (tcpConn) => {

  let peers = {}

  const connectToAllPeers = function * (action) {
    console.log('socket opened')
    let staticRemotes = yield select(peerStaticRemote)

    for (let staticRemoteString in staticRemotes) {
      yield call(connect, {type: CONNECT, publicKey: staticRemoteString})
    }
  }

  const connect = function * (action) {
    let {type, publicKey} = action
    console.log(type)
    console.log(publicKey)
    let staticRemote = wrapPubKey(Buffer.from(publicKey, 'hex'))
    let options = yield select(rootOptions)
    let peer = new Connection(options, staticRemote)
    if (peers[publicKey] !== undefined) {
      console.info('already exists...')
      return
    }

    peers[publicKey] = peer
    yield call(peer.connectPromise.bind(peer), tcpConn)
    console.log('done!!! connected ')
    yield put(connected(publicKey))
    // TODO this should happen somewhere else IMO and we need to wait for the response ideally before returning
    // yield call(sendMessage, {publicKey, message: Init(wrapHex('00'), wrapHex('00'))})
    //
    // yield delay(1000)
    // console.info('delay done..')
  }

  const onMessage = function * ({peer, msg}) {
    let pubKey = decodePeer(peer).toString('hex')

    if (peers[pubKey] === undefined) {
      console.info('No handler for message')
      return
    }

    let conn = peers[pubKey]
    let decryptedMsg = conn.feed(msg)
    if (decryptedMsg === undefined) {
      return
    }

    let parsedMsg = readMessage(decryptedMsg)

    if (parsedMsg.type === 16) {
      console.info('received init message')
      yield put(initMessageReceived(pubKey))
      // set gf lf as well
      return
    }

    if (parsedMsg.type === 17) {
      console.info('received error message ' + parsedMsg.data.toString('ascii'))
      // TODO should throw an error or something here..
      return
    }

    if (parsedMsg.type === 18) {
      console.info('received ping message')
      yield put(updateLastPing(pubKey))
      return
    }

    yield put(AT_CHANNEL.onMessage(pubKey, parsedMsg))
  }

  const disconnect = function * (action) {
  }

  const sendMessage = function * (action) {
    console.log('send message ')
    let {publicKey, message} = action
    let connection = peers[publicKey.toString('hex')]
    connection.write(writeMessage(message))
  }

  const takeSagas = function * () {
    yield takeEvery(CONNECT, connect)
    yield takeEvery(DISCONNECT, disconnect)
    yield takeEvery(PEER_MESSAGE, onMessage)
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
