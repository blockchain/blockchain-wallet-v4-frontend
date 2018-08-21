import Transport from '@ledgerhq/hw-transport-u2f'

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

export const computeDeviceFirmware = res => {
  const byteArray = [...res]
  const data = byteArray.slice(0, byteArray.length - 2)
  const targetIdStr = Buffer.from(data.slice(0, 4))
  const targetId = targetIdStr.readUIntBE(0, 4)
  const seVersionLength = data[4]
  const seVersion = Buffer.from(data.slice(5, 5 + seVersionLength)).toString()
  const flagsLength = data[5 + seVersionLength]
  const flags = Buffer.from(
    data.slice(5 + seVersionLength + 1, 5 + seVersionLength + 1 + flagsLength)
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
    return {
      targetId,
      seVersion: '0.0.0',
      flags: '',
      mcuVersion: ''
    }
  }
  return { targetId, seVersion, flags, mcuVersion }
}

export const ethAccount = (xpub, label) => ({
  label: label,
  archived: false,
  correct: true,
  addr: deriveAddressFromXpub(xpub)
})

export const btcAccount = (xpub, label) => Types.HDAccount.js(label, null, xpub)

// opens and returns a Transport with requested configuration
export const openTransport = (app, timeout) => {
  return new Promise((resolve, reject) => {
    Transport.open().then(
      transport => {
        // TODO: probably need to do this with a setTimeout or something
        transport.setExchangeTimeout(timeout || 60000) // 1 minute
        // TODO: need to account for blockchain devices
        transport.setScrambleKey(SCRAMBLEKEYS.LEDGER[app])
        resolve(transport)
      },
      error => {
        reject(error)
      }
    )
  })
}

// sends generic NO_OP cmd that any opened app will respond to
export const sendNoOpCmd = transport => {
  return new Promise(resolve => {
    // since we are sending no_op command, this is always going to fail
    // but a response, means a device is connected...
    transport.send(...APDUS.NO_OP).then(
      () => {},
      () => {
        resolve('connected')
      }
    )
  })
}

// gets firmware information about device
export const getDeviceFirmwareInfo = transport => {
  return new Promise((resolve, reject) => {
    transport.send(...APDUS.GET_FIRMWARE).then(
      res => {
        resolve(computeDeviceFirmware(res))
      },
      error => {
        reject(error)
      }
    )
  })
}

export const APDUS = {
  GET_FIRMWARE: [0xe0, 0x01, 0x00, 0x00],
  NO_OP: [0x00, 0x00, 0x00, 0x00]
}

export const SCRAMBLEKEYS = {
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
