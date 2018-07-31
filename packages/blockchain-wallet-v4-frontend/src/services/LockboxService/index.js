import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'
import { publicKeyChainCodeToBip32 } from 'blockchain-wallet-v4/src/utils/btc'

export const getXpubHash = xpub =>
  crypto.sha256(crypto.sha256(xpub).toString('hex')).toString('hex')

export const getDeviceID = deviceInfo => {
  try {
    const { btcResult } = deviceInfo
    const { publicKey, chainCode } = btcResult
    const xpub = publicKeyChainCodeToBip32(publicKey, chainCode)
    return getXpubHash(xpub)
  } catch (e) {
    throw new Error('Device Info Required')
  }
}
