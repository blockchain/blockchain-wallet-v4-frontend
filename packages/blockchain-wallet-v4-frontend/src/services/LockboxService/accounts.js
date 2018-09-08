import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'
import { publicKeyChainCodeToBip32 } from 'blockchain-wallet-v4/src/utils/btc'
import { deriveAddressFromXpub } from 'blockchain-wallet-v4/src/utils/eth'
import { Types } from 'blockchain-wallet-v4/src'
import { prop } from 'ramda'

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

const generateAccountsMDEntry = (newDevice, deviceName) => {
  /* eslint-disable */
  const device_id = prop('id', newDevice)
  const device_type = prop('type', newDevice)
  /* eslint-enable */
  const deviceInfo = prop('info', newDevice)

  try {
    const { btc, bch, eth } = deviceInfo
    const btcXpub = publicKeyChainCodeToBip32(btc)
    const bchXpub = publicKeyChainCodeToBip32(bch)
    const ethXpub = publicKeyChainCodeToBip32(eth)

    return {
      device_id,
      device_type,
      btc: { accounts: [btcAccount(btcXpub, deviceName + ' - BTC Wallet')] },
      bch: { accounts: [btcAccount(bchXpub, deviceName + ' - BCH Wallet')] },
      eth: { accounts: [ethAccount(ethXpub, deviceName + ' - ETH Wallet')] }
    }
  } catch (e) {
    throw new Error('mising_device_info')
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
