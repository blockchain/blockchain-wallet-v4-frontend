import { createWalletApi } from 'blockchain-wallet-v4/src/network'

const api = createWalletApi({
  rootUrl: 'https://blockchain.info/',
  apiUrl: 'https://api.blockchain.info/',
  apiCode: '1770d5d9-bcea-4d28-ad21-6cbd5be018a8',
  shapeShiftRootUrl: 'wss://ws.blockchain.info/inv'
})

export { api }
