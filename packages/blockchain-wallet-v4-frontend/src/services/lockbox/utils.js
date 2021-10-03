import React from 'react'
import { FormattedMessage } from 'react-intl'
import Btc from '@ledgerhq/hw-app-btc'
import Str from '@ledgerhq/hw-app-str'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import { prop } from 'ramda'
import { Observable } from 'rxjs'

import { Types } from 'blockchain-wallet-v4/src'
import { createXpubFromChildAndParent, getParentPath } from 'blockchain-wallet-v4/src/utils/btc'
import { deriveAddressFromXpub } from 'blockchain-wallet-v4/src/utils/eth'

import LOG_LEVELS from '../../data/logs/model'
import constants from './constants'
import firmware from './firmware'

const ethAccount = (xpub, label) => ({
  addr: deriveAddressFromXpub(xpub),
  archived: false,
  correct: true,
  label
})

const btcAccount = (xpub, label) =>
  Types.HDAccount.js(label, [Types.Derivation.js('legacy', 44, null, xpub)], 'legacy')

const bchAccount = (xpub, label) =>
  Types.HDAccount.js(label, [Types.Derivation.js('bch-145', 145, null, xpub)], 'bch-145')

/* eslint-disable */

/**
 * Polls for a given application to open on the device
 * @async
 * @param {String} deviceType - Either 'ledger' or 'blockchain'
 * @param {String} app - The app to connect to (BTC, DASHBOARD, etc)
 * @param {Number} timeout - Length of time in ms to wait for a connection
 * @returns {Promise<TransportU2F>} Returns a connected Transport or Error
 */
const pollForAppConnection = (deviceType, app, timeout = 45000) => {
  if (!deviceType || !app) throw new Error('Missing required params')

  return new Promise((resolve, reject) => {
    // create transport
    TransportU2F.open().then(transport => {
      // get scrambleKey
      const scrambleKey = getScrambleKey(app, deviceType)
      // configure transport
      // transport.setDebugMode(true)
      transport.setExchangeTimeout(timeout)
      transport.setScrambleKey(scrambleKey)
      console.info('POLL:START', deviceType, scrambleKey, app, timeout)
      // send NO_OP cmd until response is received (success) or timeout is hit (reject)
      transport.send(...constants.apdus.no_op).then(
        () => {},
        res => {
          // since no_op wont be recognized by any app as a valid cmd, this is always going
          // to fail but a response, means a device is connected and unlocked
          console.info('POLL:END', deviceType, scrambleKey, app, timeout)
          if (res.originalError) {
            reject(res.originalError.metaData)
          }

          resolve({ app, transport })
        }
      )
    })
  })
}

/**
 * Creates device socket
 * @param {Transport} transport - Current device transport
 * @param {String} url - The web socket url to connect to
 * @returns {Observable} the final socket result
 */
const createDeviceSocket = (transport, url) => {
  return Observable.create(o => {
    let ws, lastMessage

    try {
      ws = new WebSocket(url)
    } catch (err) {
      o.error(err.message, { url })
      return () => {}
    }

    ws.onopen = () => {
      console.info('OPENED', { url })
    }

    ws.onerror = e => {
      console.info('ERROR', { message: e.message, stack: e.stack })
      o.error(e.message, { url })
    }

    ws.onclose = () => {
      console.info('CLOSE')
      o.next(lastMessage || '')
      o.complete()
    }

    ws.onmessage = async rawMsg => {
      try {
        const msg = JSON.parse(rawMsg.data)
        if (!(msg.query in handlers)) {
          throw new Error({ message: 's0ck3t' }, { url })
        }
        console.info('RECEIVE', msg)
        await handlers[msg.query](msg)
      } catch (err) {
        console.info('ERROR', { message: err.message, stack: err.stack })
        o.error(err)
      }
    }

    const send = (nonce, response, data) => {
      const msg = {
        nonce,
        response,
        data
      }
      console.info('SEND', msg)
      const strMsg = JSON.stringify(msg)
      ws.send(strMsg)
    }

    const handlers = {
      exchange: async input => {
        const { data, nonce } = input
        const res = await transport.exchange(Buffer.from(data, 'hex'))
        const status = res.slice(res.length - 2)
        const buffer = res.slice(0, res.length - 2)
        const strStatus = status.toString('hex')
        send(
          nonce,
          strStatus === '9000' ? 'success' : 'error',
          buffer.toString('hex')
        )
      },

      bulk: async input => {
        const { data, nonce } = input
        let lastStatus // Execute all apdus and collect last status
        let i = 0
        for (const apdu of data) {
          i++
          const res = await transport.exchange(Buffer.from(apdu, 'hex'))
          lastStatus = res.slice(res.length - 2)
          if (lastStatus.toString('hex') !== '9000') break
        }
        if (!lastStatus) throw new Error({ message: 's0ck3t' }, { url })
        const isSuccess =
          lastStatus.toString('hex') === '9000' || data.length === i

        send(
          nonce,
          isSuccess ? 'success' : 'error',
          isSuccess ? '' : lastStatus.toString('hex')
        )
      },

      success: msg => {
        lastMessage = msg.data || msg.result
        ws.close()
      },

      error: msg => {
        console.info('ERROR', { data: msg.data })
        ws.close()
        throw new Error(msg.data, { url })
      }
    }

    return () => {
      if (ws.readyState === 1) {
        lastMessage = null
        ws.close()
      }
    }
  })
}

/* eslint-enable */

/**
 * Gets and parses full device information from api response
 * @param {Transport} transport - Current device transport
 * @returns {Promise} full device information
 */
const getDeviceInfo = (transport) => {
  return new Promise((resolve, reject) => {
    firmware.getDeviceFirmwareInfo(transport).then(
      (res) => {
        const { seVersion } = res
        const { flags, mcuVersion, targetId } = res
        const parsedVersion =
          seVersion.match(/([0-9]+.[0-9])+(.[0-9]+)?((?!-osu)-([a-z]+)([0-9]+))?(-osu)?/) || []
        const isOSU = typeof parsedVersion[5] !== 'undefined'
        const providerName = parsedVersion[4] || ''
        const providerId = constants.providers[providerName]
        const isBootloader = targetId === 0x01000001
        const majMin = parsedVersion[1]
        const patch = parsedVersion[2] || '.0'
        const fullVersion = `${majMin}${patch}${providerName ? `${parsedVersion[3]}` : ''}`
        resolve({
          flags,
          fullVersion: providerName === 'bc' ? seVersion : fullVersion,
          isBootloader,
          isOSU,
          mcuVersion,
          providerId,
          providerName,
          seVersion: majMin + patch,
          targetId
        })
      },
      (err) => {
        reject(err)
      }
    )
  })
}

/**
 * Maps a socket error code to a human readable error
 * @param {Promise} promise - Current device transport
 * @returns {Promise} a catch function that returns human error
 */
const mapSocketError = (promise) => {
  return promise.catch((err) => {
    switch (true) {
      case err.message.endsWith('6985'):
        return {
          err,
          errMsg: (
            <FormattedMessage
              id='lockbox.service.messages.refused'
              defaultMessage='Device connection was refused.'
            />
          )
        }
      case err.message.endsWith('6982'):
        return {
          err,
          errMsg: (
            <FormattedMessage
              id='lockbox.service.messages.locked'
              defaultMessage='Device locked and unable to communicate.'
            />
          )
        }
      case err.message.endsWith('6a84') || err.message.endsWith('6a85'):
        return {
          err,
          errMsg: (
            <FormattedMessage
              id='lockbox.service.messages.storagespace'
              defaultMessage='Insufficient storage space on device. Remove other applications to free up space.'
            />
          )
        }
      case err.message.endsWith('6a80') || err.message.endsWith('6a81'):
        return {
          err,
          errMsg: (
            <FormattedMessage
              id='lockbox.service.messages.appalreadyinstalled'
              defaultMessage='Application is already installed on device.'
            />
          )
        }
      case err.message.endsWith('6a83'):
        return {
          err,
          errMsg: (
            <FormattedMessage
              id='lockbox.service.messages.btcrequired'
              defaultMessage='Unable to remove BTC app as it is required by others.'
            />
          )
        }
      case err.message.endsWith('s0ck3t'):
        return {
          err,
          errMsg: (
            <FormattedMessage
              id='lockbox.service.messages.socket'
              defaultMessage='Socket connection failed.'
            />
          )
        }
      default:
        return {
          err,
          errMsg: (
            <FormattedMessage
              id='lockbox.service.messages.unknown'
              defaultMessage='An unknown error has occurred.'
            />
          )
        }
    }
  })
}

/**
 * Determines correct scrambleKey to use for device connection
 * @param {String} app - Current app requested
 * @param {String} deviceType - Either 'ledger' or 'blockchain'
 * @returns {String} the scrambleKey for connection
 */
const getScrambleKey = (app, deviceType) => {
  return constants.scrambleKeys[deviceType][app]
}

/**
 * Derives xPubs from device
 * @param {TransportU2F} btcApp - The BTC app connection
 * @returns {Object} the derived xPubs
 */
const deriveDeviceInfo = async (btcApp) => {
  const btcPath = "44'/0'/0'"
  const bchPath = "44'/145'/0'"
  const ethPath = "44'/60'/0'/0/0"

  const btcChild = await btcApp.getWalletPublicKey(btcPath)
  const bchChild = await btcApp.getWalletPublicKey(bchPath)
  const ethChild = await btcApp.getWalletPublicKey(ethPath)
  const btcParent = await btcApp.getWalletPublicKey(getParentPath(btcPath))
  const bchParent = await btcApp.getWalletPublicKey(getParentPath(bchPath))
  const ethParent = await btcApp.getWalletPublicKey(getParentPath(ethPath))
  const btc = createXpubFromChildAndParent(btcPath, btcChild, btcParent)
  const bch = createXpubFromChildAndParent(bchPath, bchChild, bchParent)
  const eth = createXpubFromChildAndParent(ethPath, ethChild, ethParent)

  return { bch, btc, eth }
}

/**
 * Generates metadata entry new device save
 * @param {Object} newDevice - The new device info with xPubs
 * @param {String} deviceName - The users name for the new device
 * @returns {Object} the metadata entry to save
 */
const generateAccountsMDEntry = (newDevice, deviceName) => {
  const deviceType = prop('type', newDevice)

  try {
    const { bch, btc, eth } = prop('info', newDevice)

    return {
      bch: { accounts: [bchAccount(bch, `${deviceName} - BCH Wallet`)] },
      btc: { accounts: [btcAccount(btc, `${deviceName} - BTC Wallet`)] },
      device_name: deviceName,
      device_type: deviceType,
      eth: {
        accounts: [ethAccount(eth, `${deviceName} - ETH Wallet`)],
        last_tx: null,
        last_tx_timestamp: null
      }
    }
  } catch (e) {
    throw new Error('mising_device_info')
  }
}

/**
 * Generates metadata entry new device save
 * @param {Strint} deviceName - The device name
 * @param {String} publicKey - The users xlm publicKey
 * @returns {Object} the metadata account entry to save
 */
export const generateXlmAccountMDEntry = (deviceName, publicKey) => ({
  accounts: [
    {
      archived: false,
      label: `${deviceName} - XLM Wallet`,
      publicKey
    }
  ],
  default_account_idx: 0,
  tx_notes: {}
})

/**
 * Creates and returns a new BTC/BCH app connection
 * @param {String} app - The app to connect to (BTC or BCH)
 * @param {String} deviceType - Either 'ledger' or 'blockchain'
 * @param {TransportU2F<Btc>} transport - Transport with BTC/BCH as scrambleKey
 * @returns {Btc} Returns a BTC/BCH connection
 */
const createBtcBchConnection = (app, deviceType, transport) => {
  const scrambleKey = getScrambleKey(app, deviceType)
  return new Btc(transport, scrambleKey)
}

/**
 * Gets xlm public key
 * @async
 * @param {String} deviceType - Either 'ledger' or 'blockchain'
 * @param {TransportU2F<Btc>} transport - XLM Transport
 * @returns {Promise} Returns a XLM public key promise
 */
const getXlmPublicKey = (deviceType, transport) => {
  const scrambleKey = getScrambleKey('XLM', deviceType)
  const XLM = new Str(transport, scrambleKey)
  return XLM.getPublicKey("44'/148'/0'")
}

/**
 * Formats a firmware hash
 * @async
 * @param {String} hash - THe unformatted firmware hash
 * @returns {String} Returns the formatted hash
 */
const formatFirmwareHash = (hash) => {
  if (!hash) {
    return ''
  }
  hash = hash.toUpperCase()
  const { length } = hash
  const half = Math.ceil(length / 2)
  const start = hash.slice(0, half)
  const end = hash.slice(half)
  return [start, end].join('\n')
}

/**
 * Converts a firmware version into human displayable format
 * @async
 * @param {String} raw - THe unformatted firmware version
 * @returns {String} Returns the formatted firmware name
 */
const formatFirmwareDisplayName = (raw) => {
  return raw.endsWith('-osu') ? raw.replace('-osu', '') : raw
}

export default {
  createBtcBchConnection,
  createDeviceSocket,
  deriveDeviceInfo,
  formatFirmwareDisplayName,
  formatFirmwareHash,
  generateAccountsMDEntry,
  generateXlmAccountMDEntry,
  getDeviceInfo,
  getScrambleKey,
  getXlmPublicKey,
  mapSocketError,
  pollForAppConnection
}
