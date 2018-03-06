import walletOptions from './wallet-options.json'

export const BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_BLOCKCHAIN_INFO = 'https://api.blockchain.info/'
export const API_CODE = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'

export default ({ rootUrl = BLOCKCHAIN_INFO, apiUrl = API_BLOCKCHAIN_INFO, apiCode = API_CODE } = {}, returnType) => {
  const getWalletOptions = () => (walletOptions)

  return {
    getWalletOptions
  }
}
