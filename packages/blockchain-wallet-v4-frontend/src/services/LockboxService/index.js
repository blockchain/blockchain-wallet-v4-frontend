import TransportU2F from '@ledgerhq/hw-transport-u2f'

import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'
import { publicKeyChainCodeToBip32 } from 'blockchain-wallet-v4/src/utils/btc'
import { deriveAddressFromXpub } from 'blockchain-wallet-v4/src/utils/eth'
import { Types } from 'blockchain-wallet-v4/src'

export const derviveDeviceInfo = async btcTransport => {
  const btc = await btcTransport.getWalletPublicKey("44'/0'/0'")
  const bch = await btcTransport.getWalletPublicKey("44'/145'/0'")
  const eth = await btcTransport.getWalletPublicKey("44'/60'/0'/0/0")

  return { btc, bch, eth }
}

export const generateAccountsMDEntry = deviceInfo => {
  try {
    const { btc, bch, eth } = deviceInfo
    const btcXpub = publicKeyChainCodeToBip32(btc)
    const bchXpub = publicKeyChainCodeToBip32(bch)
    const ethXpub = publicKeyChainCodeToBip32(eth)

    return {
      btc: { accounts: [btcAccount(btcXpub, 'Bitcoin Wallet')] },
      bch: { accounts: [btcAccount(bchXpub, 'Bitcoin Cash Wallet')] },
      eth: { accounts: [ethAccount(ethXpub, 'Ethereum Wallet')] }
    }
  } catch (e) {
    throw new Error('Device Info Required')
  }
}

export const deriveDeviceID = btcXpub => {
  try {
    const xpub = publicKeyChainCodeToBip32(btcXpub)
    return crypto.sha256(crypto.sha256(xpub).toString('hex')).toString('hex')
  } catch (e) {
    throw new Error('BTC Device Info Required')
  }
}

export const ethAccount = (xpub, label) => ({
  label: label,
  archived: false,
  correct: true,
  addr: deriveAddressFromXpub(xpub)
})

export const btcAccount = (xpub, label) => Types.HDAccount.js(label, null, xpub)

// gets firmware information about device
export const getDeviceFirmwareInfo = transport => {
  return new Promise((resolve, reject) => {
    transport.send(...CONSTS.APDUS.GET_FIRMWARE).then(
      res => {
        const byteArray = [...res]
        const data = byteArray.slice(0, byteArray.length - 2)
        const targetIdStr = Buffer.from(data.slice(0, 4))
        const targetId = targetIdStr.readUIntBE(0, 4)
        const seVersionLength = data[4]
        const seVersion = Buffer.from(
          data.slice(5, 5 + seVersionLength)
        ).toString()
        const flagsLength = data[5 + seVersionLength]
        const flags = Buffer.from(
          data.slice(
            5 + seVersionLength + 1,
            5 + seVersionLength + 1 + flagsLength
          )
        ).toString()

        const mcuVersionLength = data[5 + seVersionLength + 1 + flagsLength]
        let mcuVersion = Buffer.from(
          data.slice(
            7 + seVersionLength + flagsLength,
            7 + seVersionLength + flagsLength + mcuVersionLength
          )
        )
        if (mcuVersion[mcuVersion.length - 1] === 0) {
          mcuVersion = mcuVersion.slice(0, mcuVersion.length - 1)
        }
        mcuVersion = mcuVersion.toString()

        if (!seVersionLength) {
          resolve({
            targetId,
            seVersion: '0.0.0',
            flags: '',
            mcuVersion: ''
          })
        }
        resolve({ targetId, seVersion, flags, mcuVersion })
      },
      error => {
        reject(error)
      }
    )
  })
}

/**
 * Polls for a given application to open on the device
 * @async
 * @param {String} deviceType - Either 'LEDGER' or 'BLOCKCHAIN'
 * @param {String} app - The app to connect to (BTC, DASHBOARD, etc)
 * @param {Number} timeout - Length of time in ms to wait for a connection
 * @returns {Promise<Transport>} Returns a connected Transport or Error
 */
export function pollForAppConnection (deviceType, app, timeout = 30000) {
  let connectTimeout, connectionTimedOut
  if (!deviceType || !app) throw new Error('Missing required params')

  return new Promise((resolve, reject) => {
    const tOffset = 3000
    const cTimeout = timeout + tOffset

    // create transport
    TransportU2F.open().then(transport => {
      // configure transport
      transport.setExchangeTimeout(cTimeout)
      transport.setScrambleKey(CONSTS.SCRAMBLEKEYS[deviceType][app])
      // console.info('POLL START::', 'deviceType:', deviceType, 'app:', app, 'scrambleKey:', CONSTS.SCRAMBLEKEYS[deviceType][app])

      // close transport and reject promise if timeout is reached
      connectTimeout = setTimeout(() => {
        connectionTimedOut = true
        reject(new Error(`${cTimeout - tOffset}ms timeout exceeded.`))
      }, cTimeout - tOffset)

      // send NO_OP cmd until response is received (success) or timeout is hit (reject)
      transport.send(...CONSTS.APDUS.TEST).then(
        () => {},
        res => {
          // since no_op wont be recognized by any app as a valid cmd, this is always going
          // to fail but a response, means a device is connected and unlocked
          // console.info('POLL END::', 'deviceType:', deviceType, 'app:', app, 'scrambleKey:', CONSTS.SCRAMBLEKEYS[deviceType][app])
          if (!connectionTimedOut) {
            clearTimeout(connectTimeout)

            resolve(app)
          }
        }
      )
    })
  })
}

//
// PRIVATE CONSTANTS
//
export const CONSTS = {
  APDUS: {
    GET_FIRMWARE: [0xe0, 0x01, 0x00, 0x00],
    NO_OP: [0x00, 0x00, 0x00, 0x00],
    TEST: [0xe0, 0xc4, 0x00, 0x00]
  },
  SCRAMBLEKEYS: {
    BLOCKCHAIN: {
      BCH: 'blockchain-bch',
      BTC: 'blockchain-btc',
      DASHBOARD: 'blockchain',
      ETH: 'blockchain-eth'
    },
    LEDGER: {
      BCH: 'BTC',
      BTC: 'BTC',
      DASHBOARD: 'B0L0S',
      ETH: 'w0w'
    }
  }
}
