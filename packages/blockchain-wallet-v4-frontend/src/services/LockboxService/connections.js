import Transport from '@ledgerhq/hw-transport-u2f'
import constants from './constants'

/**
 * Polls for a given application to open on the device
 * @async
 * @param {String} deviceType - Either 'LEDGER' or 'BLOCKCHAIN'
 * @param {String} app - The app to connect to (BTC, DASHBOARD, etc)
 * @param {Number} timeout - Length of time in ms to wait for a connection
 * @returns {Promise<Transport>} Returns a connected Transport or Error
 */
const pollForAppConnection = (deviceType, app, timeout = 30000) => {
  let connectTimeout, connectionTimedOut
  if (!deviceType || !app) throw new Error('Missing required params')

  return new Promise((resolve, reject) => {
    const tOffset = 3000
    const cTimeout = timeout + tOffset

    // create transport
    Transport.open().then(transport => {
      // configure transport
      transport.setExchangeTimeout(cTimeout)
      transport.setScrambleKey(constants.scrambleKeys[deviceType][app])

      // close transport and reject promise if timeout is reached
      connectTimeout = setTimeout(() => {
        connectionTimedOut = true
        transport.close()
        reject(new Error(`${cTimeout - tOffset}ms timeout exceeded.`))
      }, cTimeout - tOffset)

      // send NO_OP cmd until response is received (success) or timeout is hit (reject)
      transport.send(...constants.apdus.no_op).then(
        () => {},
        () => {
          // since no_op wont be recognized by any app as a valid cmd, this is always going
          // to fail but a response, means a device is connected and unlocked
          if (!connectionTimedOut) {
            // TODO: why doesnt transport.close() work...?
            clearTimeout(connectTimeout)
            resolve(transport)
          }
        }
      )
    })
  })
}

export default {
  pollForAppConnection
}
