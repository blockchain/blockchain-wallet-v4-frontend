import bitcoin from './bitcoin'
import ethereum from './ethereum'
import kvStore from './kvStore'
import misc from './misc'
import options from './options'
import settings from './settings'
import shapeShift from './shapeShift'
import wallet from './wallet'
import fetchService from './fetch'

export const BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_BLOCKCHAIN_INFO = 'https://api.blockchain.info/'
export const API_CODE = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'

export const SHAPESHIFT_IO = 'https://shapeshift.io/'

export default ({ rootUrl = BLOCKCHAIN_INFO, apiUrl = API_BLOCKCHAIN_INFO, apiCode = API_CODE, shapeShiftRootUrl = SHAPESHIFT_IO } = {}) => {
  const { get, post } = fetchService({ apiCode })

  return {
    ...bitcoin({ rootUrl, apiUrl, get, post }),
    ...ethereum({ rootUrl, apiUrl, get, post }),
    ...kvStore({ apiUrl }),
    ...misc({ rootUrl, apiUrl, get, post }),
    ...options({ rootUrl, apiUrl, get, post }),
    ...settings({ rootUrl, apiUrl, get, post }),
    ...shapeShift({ shapeShiftRootUrl }),
    ...wallet({ rootUrl, apiUrl, get, post })
  }
}
