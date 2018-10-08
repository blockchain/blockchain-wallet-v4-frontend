import TransportU2F from '@ledgerhq/hw-transport-u2f'
import Btc from '@ledgerhq/hw-app-btc'

import constants from './constants'
import utils from './utils'

/**
 * Creates and returns a new BTC/BCH app connection
 * @param {String} app - The app to connect to (BTC, DASHBOARD, etc)
 * @param {String} deviceType - Either 'ledger' or 'blockchain'
 * @param {TransportU2F<Btc>} transport - Transport with BTC/BCH as scrambleKey
 * @returns {Btc} Returns a BTC/BCH connection
 */
const createBtcBchConnection = (app, deviceType, transport) => {
  const scrambleKey = utils.getScrambleKey(app, deviceType)
  return new Btc(transport, scrambleKey)
}

/**
 * Polls for a given application to open on the device
 * @async
 * @param {String} deviceType - Either 'ledger' or 'blockchain'
 * @param {String} app - The app to connect to (BTC, DASHBOARD, etc)
 * @param {Number} timeout - Length of time in ms to wait for a connection
 * @returns {Promise<TransportU2F>} Returns a connected Transport or Error
 */
function pollForAppConnection(deviceType, app, timeout = 60000) {
  if (!deviceType || !app) throw new Error('Missing required params')

  return new Promise((resolve, reject) => {
    // create transport
    TransportU2F.open().then(transport => {
      // get scrambleKey
      const scrambleKey = utils.getScrambleKey(app, deviceType)
      // configure transport
      transport.setExchangeTimeout(timeout)
      transport.setScrambleKey(scrambleKey)
      // send NO_OP cmd until response is received (success) or timeout is hit (reject)
      transport.send(...constants.apdus.no_op).then(
        () => {},
        res => {
          // since no_op wont be recognized by any app as a valid cmd, this is always going
          // to fail but a response, means a device is connected and unlocked
          if (res.originalError) {
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
  pollForAppConnection
}
