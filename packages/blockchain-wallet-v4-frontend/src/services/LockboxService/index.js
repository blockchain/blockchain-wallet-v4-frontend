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
    const btcXpub = publicKeyChainCodeToBip32(btc)
    const bchXpub = publicKeyChainCodeToBip32(bch)
    const ethXpub = publicKeyChainCodeToBip32(eth)

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
    const xpub = publicKeyChainCodeToBip32(btc)
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
