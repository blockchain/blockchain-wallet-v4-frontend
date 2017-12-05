
import TCP from './TCP'
import Peer from './peer'
import {State} from './state'

export const startUp = (options) => {
  let tcp = new TCP()

  let state = State()

  let get = () => state
  let set = (s) => { state = s }
  let update = (s) => { state = s(state) }

  let s = {get, set, update}

  tcp.connectToMaster(() => {
    connect(options, s, tcp, '02064792bfd15aa44906c8d20da44adc095c57cd0aeb3a8c4a29662fb814eb8d08')
  })
}

export const connect = (options, state, tcp, key) => {
  let staticRemote = {}
  staticRemote.pub = Buffer.from(key, 'hex')

  let peer = new Peer(options, state, tcp, staticRemote)
}
