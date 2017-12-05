'use strict'

import Connection from './connection'
import * as Parse from './messages/parser'
import TYPE from './messages/types'
import * as Message from './messages/serializer'
import * as Time from 'unix-timestamp'
import * as State from './state'

function Peer (options, state, tcp, staticRemote) {
  console.info(JSON.stringify(staticRemote))
  this.options = options

  this.state = state

  let onHandshake = () => {
    this.state.connections[staticRemote.pub] = State.Connection()

    this.send(new Message.Init(Buffer.alloc(0), Buffer.from('08', 'hex')))
  }

  let onClose = () => {
    this.state.connections[staticRemote.pub] = null
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
    state.lastPing = Time.now(0)
    return state
  }

  let onPong = (msg, state) => {
    return state
  }

  let onInit = (msg, state) => {
    state.initReceived = true
    state.gfRemote = msg.gf
    state.lfRemote = msg.lf

    if (!state.initSent) {
      this.send(new Message.Init(Buffer.alloc(0), Buffer.from('08', 'hex')))
      state.initSent = true
    }

    return state
  }

  let onError = (msg, state) => {
    console.warn('received error message: ' + msg)
    state.error = msg
    return state
  }

  let getMessageHandler = (data) => {
    switch (data.type) {
      case TYPE.INIT: return onInit
      case TYPE.ERROR: return onError
      case TYPE.PING: return onPing
      case TYPE.PONG: return onPong

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
