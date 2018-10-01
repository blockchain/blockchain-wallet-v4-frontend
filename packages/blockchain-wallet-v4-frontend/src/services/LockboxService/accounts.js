import {
  createXpubFromChildAndParent,
  getParentPath
} from 'blockchain-wallet-v4/src/utils/btc'
import { deriveAddressFromXpub } from 'blockchain-wallet-v4/src/utils/eth'
import { Types } from 'blockchain-wallet-v4/src'
import { prop } from 'ramda'

const deriveDeviceInfo = async ledgerApp => {
  let btcPath = "44'/0'/0'"
  let bchPath = "44'/145'/0'"
  let ethPath = "44'/60'/0'/0/0"

  let btcChild = await ledgerApp.getWalletPublicKey(btcPath)
  let bchChild = await ledgerApp.getWalletPublicKey(bchPath)
  let ethChild = await ledgerApp.getWalletPublicKey(ethPath)
  let btcParent = await ledgerApp.getWalletPublicKey(getParentPath(btcPath))
  let bchParent = await ledgerApp.getWalletPublicKey(getParentPath(bchPath))
  let ethParent = await ledgerApp.getWalletPublicKey(getParentPath(ethPath))
  const btc = createXpubFromChildAndParent(btcPath, btcChild, btcParent)
  const bch = createXpubFromChildAndParent(bchPath, bchChild, bchParent)
  const eth = createXpubFromChildAndParent(ethPath, ethChild, ethParent)

  return { btc, bch, eth }
}

const generateAccountsMDEntry = (newDevice, deviceName) => {
  const deviceType = prop('type', newDevice)

  try {
    const { btc, bch, eth } = prop('info', newDevice)

    return {
      device_type: deviceType,
      device_name: deviceName,
      btc: { accounts: [btcAccount(btc, deviceName + ' - BTC Wallet')] },
      bch: { accounts: [btcAccount(bch, deviceName + ' - BCH Wallet')] },
      eth: {
        accounts: [ethAccount(eth, deviceName + ' - ETH Wallet')],
        last_tx: null,
        last_tx_timestamp: null
      }
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
  ethAccount,
  deriveDeviceInfo,
  generateAccountsMDEntry
}
