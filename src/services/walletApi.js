import { createWalletApi } from 'dream-wallet/lib/network'
import settings from 'config'

export const api = createWalletApi({
  rootUrl: settings.ROOT_URL,
  apiUrl: settings.API_BLOCKCHAIN_INFO,
  apiCode: settings.API_CODE
})
