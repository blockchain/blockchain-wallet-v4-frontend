import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'
import { publicKeyChainCodeToBip32 } from 'blockchain-wallet-v4/src/utils/btc'
import { deriveAddressFromXpub } from 'blockchain-wallet-v4/src/utils/eth'
import { Types } from 'blockchain-wallet-v4/src'

const deriveDeviceInfo = async btcTransport => {
  const btc = await btcTransport.getWalletPublicKey("44'/0'/0'")
  const bch = await btcTransport.getWalletPublicKey("44'/145'/0'")
  const eth = await btcTransport.getWalletPublicKey("44'/60'/0'/0/0")

  return { btc, bch, eth }
}

const deriveDeviceId = btcXpub => {
  try {
    const xpub = publicKeyChainCodeToBip32(btcXpub)
    return crypto.sha256(crypto.sha256(xpub).toString('hex')).toString('hex')
  } catch (e) {
    throw new Error('BTC Device Info Required')
  }
}

const generateAccountsMDEntry = deviceInfo => {
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

const ethAccount = (xpub, label) => ({
  label: label,
  archived: false,
  correct: true,
  addr: deriveAddressFromXpub(xpub)
})

const btcAccount = (xpub, label) => Types.HDAccount.js(label, null, xpub)

export default {
  btcAccount,
  deriveDeviceInfo,
  deriveDeviceId,
  ethAccount,
  generateAccountsMDEntry
}
