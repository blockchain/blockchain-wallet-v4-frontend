import walletSync from './walletSync/middleware.js'
import socket from './webSocket/middleware.js'
import kvStore from './kvStore/middleware.js'
import ln from './../ln/middleware'

export {
  socket,
  walletSync,
  kvStore,
  ln
}
