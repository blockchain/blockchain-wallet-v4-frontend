
import TCP from './TCP'
import Peer from './peer'
import State from './state'

export const startUp = (options) => {
  let tcp = new TCP()

  tcp.connectToMaster(() => {
    connect(options, tcp, '022a72195e7eaf2f032fef55114ba026f573e34f7606edb3089d5189a0b2a368cd')
  })
}

export const connect = (options, tcp, key) => {
  let staticRemote = {}
  staticRemote.pub = Buffer.from(key, 'hex')

  let state = State()

  let peer = new Peer(options, state, tcp, staticRemote)
}
