import walletSync from './walletSync/middleware.js'
import * as socket from './webSocket/middleware.js'
import kvStore from './kvStore/middleware.js'

export {
  socket,
  walletSync,
  kvStore
}
