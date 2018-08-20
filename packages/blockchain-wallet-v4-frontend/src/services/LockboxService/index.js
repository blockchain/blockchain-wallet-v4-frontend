import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'
import { publicKeyChainCodeToBip32 } from 'blockchain-wallet-v4/src/utils/btc'
import { deriveAddressFromXpub } from 'blockchain-wallet-v4/src/utils/eth'
import { Types } from 'blockchain-wallet-v4/src'

const deviceInfoErr = 'Device Info Required'

export const getXpubHash = xpub =>
  crypto.sha256(crypto.sha256(xpub).toString('hex')).toString('hex')

export const generateAccountsMDEntry = deviceInfo => {
  try {
    const { btc, bch, eth } = deviceInfo
    const btcXpub = publicKeyChainCodeToBip32(btc.publicKey, btc.chainCode)
    const bchXpub = publicKeyChainCodeToBip32(bch.publicKey, bch.chainCode)
    const ethXpub = publicKeyChainCodeToBip32(eth.publicKey, eth.chainCode)

    return {
      btc: { accounts: [btcAccount(btcXpub, 'Bitcoin Wallet')] },
      bch: { accounts: [btcAccount(bchXpub, 'Bitcoin Cash Wallet')] },
      eth: { accounts: [ethAccount(ethXpub, 'Ethereum Wallet')] }
    }
  } catch (e) {
    throw new Error(deviceInfoErr)
  }
}

export const getDeviceID = deviceInfo => {
  try {
    const { btc } = deviceInfo
    const { publicKey, chainCode } = btc
    const xpub = publicKeyChainCodeToBip32(publicKey, chainCode)
    return getXpubHash(xpub)
  } catch (e) {
    throw new Error(deviceInfoErr)
  }
}

export const computeDeviceFirmware = (res) => {
  const byteArray = [...res]
  const data = byteArray.slice(0, byteArray.length - 2)
  const targetIdStr = Buffer.from(data.slice(0, 4))
  const targetId = targetIdStr.readUIntBE(0, 4)
  const seVersionLength = data[4]
  const seVersion = Buffer.from(data.slice(5, 5 + seVersionLength)).toString()
  const flagsLength = data[5 + seVersionLength]
  const flags = Buffer.from(
    data.slice(5 + seVersionLength + 1, 5 + seVersionLength + 1 + flagsLength),
  ).toString()

  const mcuVersionLength = data[5 + seVersionLength + 1 + flagsLength]
  let mcuVersion = Buffer.from(
    data.slice(
      7 + seVersionLength + flagsLength,
      7 + seVersionLength + flagsLength + mcuVersionLength,
    ),
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
      mcuVersion: '',
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
    BCH: 'BTC', // Not sure if this is correct
    BTC: 'BTC',
    DASHBOARD: 'B0L0S',
    ETH: 'w0w'
  }
}
