import { createWalletApi } from 'blockchain-wallet-v4/src/network'
import settings from 'config'

const api = createWalletApi({
  rootUrl: settings.ROOT_URL,
  apiUrl: settings.API_URL,
  apiCode: settings.API_CODE,
  shapeShiftRootUrl: settings.SHAPESHIFT_ROOT_URL
})

export { api }
