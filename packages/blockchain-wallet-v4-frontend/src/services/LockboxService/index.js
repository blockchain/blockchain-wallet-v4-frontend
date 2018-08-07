import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'
import { publicKeyChainCodeToBip32 } from 'blockchain-wallet-v4/src/utils/btc'
import { deriveAddressFromXpub } from 'blockchain-wallet-v4/src/utils/eth'
import { Types } from 'blockchain-wallet-v4/src'

const deviceInfoErr = 'Device Info Required'

export const getXpubHash = xpub =>
  crypto.sha256(crypto.sha256(xpub).toString('hex')).toString('hex')

export const generateAccountsMDEntry = (deviceInfo, deviceName) => {
  try {
    const { btc, bch, eth } = deviceInfo
    const btcXpub = publicKeyChainCodeToBip32(btc.publicKey, btc.chainCode)
    const bchXpub = publicKeyChainCodeToBip32(bch.publicKey, bch.chainCode)
    const ethXpub = publicKeyChainCodeToBip32(eth.publicKey, eth.chainCode)

    return {
      btc: { accounts: [btcAccount(btcXpub, deviceName + ' Bitcoin Wallet')] },
      bch: {
        accounts: [btcAccount(bchXpub, deviceName + ' Bitcoin Cash Wallet')]
      },
      eth: { accounts: [ethAccount(ethXpub, deviceName + ' Ethereum Wallet')] }
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

export const ethAccount = (xpub, label) => ({
  label: label,
  archived: false,
  correct: true,
  addr: deriveAddressFromXpub(xpub)
})

export const btcAccount = (xpub, label) => Types.HDAccount.js(label, null, xpub)
