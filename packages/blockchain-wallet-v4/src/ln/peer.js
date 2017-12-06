'use strict'

import {fromJS} from 'immutable'
import {Connection, sendOutAllMessages} from './connection'
import * as Parse from './messages/parser'
import TYPE from './messages/types'
import * as Message from './messages/serializer'
import * as Time from 'unix-timestamp'
import * as State from './state'
import * as Long from 'long'
import {openChannel, readAcceptChannel, sendFundingCreated, readFundingSigned} from './channel'
import {wrapHex} from './helper'

function Peer (options, stateHolder, tcp, staticRemote) {
  console.info(JSON.stringify(staticRemote))
  this.options = options

  let onHandshake = () => {
    let state = stateHolder.get()
    state = state
      .setIn(['connections', staticRemote.pub], State.Connection())
      .setIn(['connections', staticRemote.pub, 'conn'], this.conn)

    // TODO correctly wire this up as an initMessage
    this.send(new Message.Init(Buffer.alloc(0), wrapHex('08')))

    // TODO move opening a channel somewhere else
    state = openChannel(state, staticRemote, options, Long.fromNumber(100000))

    state = sendOutAllMessages(state)
    stateHolder.set(state)
  }

  let onClose = () => {
    stateHolder.update(s => s.setIn(['connections', staticRemote.pub], null))
    console.info('Connection to ' + staticRemote.pub.toString('hex') + ' closed!')
  }

  let parse = (data) => {
    let msg = Parse.readMessage(data)
    let state = stateHolder.get()
    state = onMessage(msg, state)
    state = sendOutAllMessages(state)
    stateHolder.set(state)
  }

  let onMessage = (data, state) => {
    return getMessageHandler(data)(data, state)
  }

  let onPing = (msg, state) => {
    this.send(new Message.Pong(msg.byteslen))
    return state.updateIn(['connections', staticRemote.pub, 'lastPing'], Time.now(0))
  }

  let onPong = (msg, state) => {
    return state
  }

  let onInit = (msg, state) => {
    let connState = state.getIn(['connections', staticRemote.pub]).toJS()

    connState.initReceived = true
    connState.gfRemote = msg.gf
    connState.lfRemote = msg.lf
    if (!connState.initSent) {
      this.send(new Message.Init(Buffer.alloc(0), wrapHex('08')))
      connState.initSent = true
    }

    return state
      .setIn(['connections', staticRemote.pub], fromJS(connState))
  }

  let onError = (msg, state) => {
    console.info('ERROR: ' + msg.data.toString('ascii'))
    state.error = msg
    return state
  }

  let onAcceptChannel = (msg, state) => {
    let channelId = msg.temporaryChannelId

    state = readAcceptChannel(msg, state, state.getIn(['connections', staticRemote.pub]))
    state = sendFundingCreated(state, channelId, State.Wallet())
    return state
  }

  let onFundingSigned = (msg, state) => {
    state = readFundingSigned(msg, state)
    return state
  }

  let getMessageHandler = (data) => {
    switch (data.type) {
      case TYPE.INIT: return onInit
      case TYPE.ERROR: return onError
      case TYPE.PING: return onPing
      case TYPE.PONG: return onPong
      case TYPE.ACCEPT_CHANNEL: return onAcceptChannel
      case TYPE.FUNDING_SIGNED: return onFundingSigned

      default: throw new Error('No message handler for ' + JSON.stringify(data))
    }
  }

  this.conn = new Connection(options, staticRemote)
  this.conn.connect(
    tcp,
    () => { console.log('connected!') },
    onHandshake,
    parse,
    onClose
  )
}

Peer.prototype.send = function send (msg) {
  this.conn.write(Parse.writeMessage(msg))
}

export default Peer
