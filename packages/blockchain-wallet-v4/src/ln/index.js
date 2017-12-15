
import TCP from './TCP'
import Peer from './peer'
import {State, StateHolder} from './state'
import {wrapHex} from './helper'
import {sendOutAllMessages} from './connection'
import {wrapPubKey} from './channel'

export const startUp = (options) => {
  let tcp = new TCP()

  let state = State()
  let stateHolder = new StateHolder(state)

  tcp.connectToMaster(() => {
    connect(options, stateHolder, tcp, '02f1da524a70afd8de6019e2367b47d8d41a623aa3594f55d0785fe1b047c853bc')
  })
}

export const connect = (options, stateHolder, tcp, key) => {
  let staticRemote = {}
  staticRemote.pub = wrapHex(key)

  let peer = new Peer(options, tcp, staticRemote)

  let handshakeCb = (state) => peer.createPaymentChannel(state, 100000)

  peer.connect(stateHolder, handshakeCb)
}
