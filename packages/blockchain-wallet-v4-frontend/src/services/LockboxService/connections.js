import TransportU2F from '@ledgerhq/hw-transport-u2f'
import Btc from '@ledgerhq/hw-app-btc'
import Eth from '@ledgerhq/hw-app-eth'
import { path } from 'ramda'

import constants from './constants'

/**
 * Creates and returns a new BTC app connection
 * @param {TransportU2F<Btc>} btcTransport - Transport with BTC as scrambleKey
 * @returns {Btc} Returns a BTC connection
 */
const createBtcBchConnection = btcTransport => {
  return new Btc(btcTransport)
}

/**
 * Creates and returns a new BTC app connection
 * @param {TransportU2F<Eth>} ethTransport - Transport with ETH as scrambleKey
 * @returns {Eth} Returns a ETH connection
 */
const createEthConnection = ethTransport => {
  return new Eth(ethTransport)
}

/**
 * Polls for a given application to open on the device
 * @async
 * @param {String} deviceType - Either 'LEDGER' or 'BLOCKCHAIN'
 * @param {String} app - The app to connect to (BTC, DASHBOARD, etc)
 * @param {Number} timeout - Length of time in ms to wait for a connection
 * @returns {Promise<TransportU2F>} Returns a connected Transport or Error
 */
function pollForAppConnection (deviceType, app, timeout = 3000) {
  if (!deviceType || !app) throw new Error('Missing required params')
  return new Promise((resolve, reject) => {
    // create transport
    TransportU2F.open().then(transport => {
      // configure transport
      transport.setExchangeTimeout(timeout)
      transport.setScrambleKey(constants.scrambleKeys[deviceType][app])
      // send NO_OP cmd until response is received (success) or timeout is hit (reject)
      transport.send(...constants.apdus.no_op).then(
        () => {},
        res => {
          // since no_op wont be recognized by any app as a valid cmd, this is always going
          // to fail but a response, means a device is connected and unlocked
          if (path(res.originalError)) {
            reject(res.originalError.metaData)
          }

          resolve({ app, transport })
        }
      )
    })
  })
}

export default {
  createBtcBchConnection,
  createEthConnection,
  pollForAppConnection
}
