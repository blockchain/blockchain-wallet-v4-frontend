import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'
import { publicKeyChainCodeToBip32 } from 'blockchain-wallet-v4/src/utils/btc'
import { deriveAddressFromXpub } from 'blockchain-wallet-v4/src/utils/eth'
import { Types } from 'blockchain-wallet-v4/src'

const deviceInfoErr = 'Device Info Required'

export const getXpubHash = xpub =>
  crypto.sha256(crypto.sha256(xpub).toString('hex')).toString('hex')

export const generateMDEntry = deviceInfo => {
  try {
    const { btc, eth } = deviceInfo
    const btcXpub = publicKeyChainCodeToBip32(btc.publicKey, btc.chainCode)
    const ethXpub = publicKeyChainCodeToBip32(eth.publicKey, eth.chainCode)

    return {
      btc: { accounts: [btcAccount(btcXpub)] },
      eth: { accounts: [ethAccount(ethXpub)] }
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

export const ethAccount = xpub => ({
  label: 'My Ether Lockbox Wallet',
  archived: false,
  correct: true,
  addr: deriveAddressFromXpub(xpub)
})

export const btcAccount = xpub =>
  Types.HDAccount.js('My Bitcoin Lockbox Wallet', null, xpub)
