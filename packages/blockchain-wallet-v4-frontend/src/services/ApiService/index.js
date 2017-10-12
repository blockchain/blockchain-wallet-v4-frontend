import * as blockchainWallet from 'blockchain-wallet-v4/src'
import settings from 'config'

export const api = blockchainWallet.Network.createWalletApi({
  rootUrl: settings.ROOT_URL,
  apiUrl: settings.API_BLOCKCHAIN_INFO,
  apiCode: settings.API_CODE
})
