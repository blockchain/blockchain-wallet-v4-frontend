import data from './data'
import options from './options'
import settings from './settings'
import wallet from './wallet'
import fetchService from './fetch'

export const BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_BLOCKCHAIN_INFO = 'https://api.blockchain.info/'
export const API_CODE = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'

export default ({ rootUrl = BLOCKCHAIN_INFO, apiUrl = API_BLOCKCHAIN_INFO, apiCode = API_CODE } = {}) => {
  const { get, post } = fetchService({ apiCode })

  return {
    ...data({ rootUrl, apiUrl, get, post }),
    ...options({ rootUrl, apiUrl, get, post }),
    ...settings({ rootUrl, apiUrl, get, post }),
    ...wallet({ rootUrl, apiUrl, get, post })
  }
}
