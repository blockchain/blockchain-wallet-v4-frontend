import { createApi, createKvApi } from 'blockchain-wallet-v4/src/network'
import settings from 'config'

const api = createApi({
  rootUrl: settings.ROOT_URL,
  apiUrl: settings.API_BLOCKCHAIN_INFO,
  apiCode: settings.API_CODE
})

const kvStoreApi = createKvApi({
  apiUrl: settings.API_BLOCKCHAIN_INFO
})

console.log(api)

export { api, kvStoreApi }
