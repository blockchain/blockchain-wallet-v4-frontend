'use strict'

import {fromJS} from 'immutable'
import * as Parse from '../../messages/parser'
import TYPE from '../../messages/types'
import * as Message from '../../messages/serializer'
import * as Time from 'unix-timestamp'
import * as State from '../../state'
import * as Long from 'long'
import {openChannel, readAcceptChannel, sendFundingCreated, readFundingSigned} from '../../channel'
import {identity, wrapHex} from '../../helper';
import {Connection} from '../connection'

let updateState = (stateHolder) => (fun) => {
  stateHolder.update(s => fun(s))
}

let updateConnectionState = staticRemote => fun => state => {
  return state.updateIn(['connections', staticRemote.pub], channelState => fun(channelState))
}

let onHandshake = (peer) => () => {
  let connectionState = State.Connection()
    .set('conn', peer.conn)

  // TODO proper init message
  peer.send(new Message.Init(Buffer.alloc(0), wrapHex('08')))

  return connectionState
}

let onClose = () => () => {
  console.info('Connection closed!')
  return null
}

let onPing = (msg) => (connectionState) => {
  this.send(new Message.Pong(msg.byteslen))
  return connectionState.update('lastPing', Time.now(0))
}

let onInit = (staticRemote, handshakeCb, msg) => (state) => {
  let connectionState = state.getIn(['connections', staticRemote.pub]).toJS()

  connectionState.initReceived = true
  connectionState.gfRemote = msg.gf
  connectionState.lfRemote = msg.lf
  console.info('INIT RECEIVED!!!')
  if (!connectionState.initSent) {
    this.send(new Message.Init(Buffer.alloc(0), wrapHex('08')))
    connectionState.initSent = true
  }
  state = state.setIn(['connections', staticRemote.pub], fromJS(connectionState))
  state = handshakeCb(state)
  return state
}

let onError = (msg) => (s) => {
  console.info('ERROR: ' + msg.data.toString('ascii'))
  // TODO need to write error message to channel state if available
}

let onAcceptChannel = (staticRemote, msg) => state => {
  let channelId = msg.temporaryChannelId

  state = readAcceptChannel(msg, state, state.getIn(['connections', staticRemote.pub]))
  state = sendFundingCreated(state, channelId, State.Wallet())
  return state
}

let onFundingSigned = msg => state => {
  state = readFundingSigned(msg, state)
  return state
}

let getMessageHandler = (staticRemote, handshakeCb) => data => {
  let msg = Parse.readMessage(data)
  let updater = updateConnectionState(staticRemote)

  switch (msg.type) {
    case TYPE.INIT: return onInit(staticRemote, handshakeCb, msg)
    case TYPE.ERROR: return updater(onError(msg))
    case TYPE.PING: return updater(onPing(msg))
    case TYPE.PONG: return identity
    case TYPE.ACCEPT_CHANNEL: return onAcceptChannel(staticRemote, msg)
    case TYPE.FUNDING_SIGNED: return onFundingSigned(msg)

    case TYPE.ANNOUNCEMENT_SIGNATURES: return identity
    case TYPE.CHANNEL_ANNOUNCEMENT: return identity
    case TYPE.NODE_ANNOUNCEMENT: return identity
    case TYPE.CHANNEL_UPDATE: return identity

    default: throw new Error('No message handler for ' + JSON.stringify(msg))
  }
}

function Peer (options, tcp, staticRemote) {
  this.options = options
  this.staticRemote = staticRemote
  this.tcp = tcp
  this.conn = new Connection(options, staticRemote)
}

Peer.prototype.connect = function connect (state, handshakeCb) {
  let update = updateState(state)
  let updateConnection = updateConnectionState(this.staticRemote)
  let messageHandler = getMessageHandler(this.staticRemote, handshakeCb)

  this.conn.connect(
    this.tcp,
    () => {},
    () => update(updateConnection(onHandshake(this))),
    (msg) => { update(messageHandler(msg)) },
    onClose)
}

Peer.prototype.createPaymentChannel = function createPaymentChannel (state, amount) {
  return openChannel(state, this.staticRemote, this.options, Long.fromNumber(amount))
}

Peer.prototype.send = function send (msg) {
  this.conn.write(Parse.writeMessage(msg))
}

export default Peer
