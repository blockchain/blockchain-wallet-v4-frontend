import walletSync from './walletSync/middleware.js'
import socket from './webSocket/middleware.js'
import kvStore from './kvStore/middleware.js'

export {
  socket,
  walletSync,
  kvStore
}
