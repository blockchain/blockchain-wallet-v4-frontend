import TransportU2F from '@ledgerhq/hw-transport-u2f'
import Btc from '@ledgerhq/hw-app-btc'

import constants from './constants'
/*eslint-disable*/

/**
 * Creates and returns a new BTC app connection
 * @param {TransportU2F<Btc>} btcTransport - Transport with BTC as scrambleKey
 * @returns {Btc} Returns a BTC connection
 */
const createBtcConnection = btcTransport => {
  return new Btc(btcTransport)
}
/**
 * Polls for a given application to open on the device
 * @async
 * @param {String} deviceType - Either 'LEDGER' or 'BLOCKCHAIN'
 * @param {String} app - The app to connect to (BTC, DASHBOARD, etc)
 * @param {Number} timeout - Length of time in ms to wait for a connection
 * @returns {Promise<TransportU2F>} Returns a connected Transport or Error
 */
function pollForAppConnection(deviceType, app, timeout = 30000) {
  let connectTimeout, connectionTimedOut
  if (!deviceType || !app) throw new Error('Missing required params')

  return new Promise((resolve, reject) => {
    const tOffset = 3000
    const cTimeout = timeout + tOffset

    // create transport
    TransportU2F.open().then(transport => {
      // configure transport
      transport.setExchangeTimeout(cTimeout)
      transport.setScrambleKey(constants.scrambleKeys[deviceType][app])
      console.info(
        'POLL START::',
        'deviceType:',
        deviceType,
        'app:',
        app,
        'scrambleKey:',
        constants.scrambleKeys[deviceType][app]
      )

      // close transport and reject promise if timeout is reached
      connectTimeout = setTimeout(() => {
        connectionTimedOut = true
        reject(new Error(`${cTimeout - tOffset}ms timeout exceeded.`))
      }, cTimeout - tOffset)

      // send NO_OP cmd until response is received (success) or timeout is hit (reject)
      transport
        .send(...constants.apdus.no_op)
        .then(
          () => {},
          () => {
            // since no_op wont be recognized by any app as a valid cmd, this is always going
            // to fail but a response, means a device is connected and unlocked
            console.info(
              'POLL END::',
              'deviceType:',
              deviceType,
              'app:',
              app,
              'scrambleKey:',
              constants.scrambleKeys[deviceType][app]
            ) // eslint-disable-line
            if (!connectionTimedOut) {
              clearTimeout(connectTimeout)
              resolve({ app, transport })
            }
          }
        )
        .finally(() => {
          transport.close()
        })
    })
  })
}

export default {
  createBtcConnection,
  pollForAppConnection
}
/* eslint-enable */
