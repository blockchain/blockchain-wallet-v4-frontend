import { createWalletApi } from 'blockchain-wallet-v4/src/network'
import Config from 'react-native-config'

const api = createWalletApi({
  rootUrl: Config.ROOT_URL,
  apiUrl: Config.API_URL,
  apiCode: Config.API_CODE
})

export { api }
