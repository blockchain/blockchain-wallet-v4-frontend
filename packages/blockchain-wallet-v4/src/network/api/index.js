import bitcoin from './btc'
import delegate from './delegate'
import ethereum from './eth'
import bch from './bch'
import kvStore from './kvStore'
import kyc from './kyc'
import misc from './misc'
import profile from './profile'
import settings from './settings'
import shapeShift from './shapeShift'
import sfox from './sfox'
import wallet from './wallet'
import fetchService from './fetch'
import httpService from './http'

export default ({ options, apiKey } = {}) => {
  const { get, post } = fetchService({ apiKey })
  const http = httpService({ apiKey })
  const apiUrl = options.domains.api
  const nabuUrl = `${apiUrl}/nabu-app`
  const rootUrl = options.domains.root
  const shapeShiftApiKey = options.platforms.web.shapeshift.config.apiKey

  return {
    ...bitcoin({ rootUrl, apiUrl, get, post }),
    ...delegate({ rootUrl, apiUrl, get, post }),
    ...ethereum({ rootUrl, apiUrl, get, post }),
    ...bch({ rootUrl, apiUrl, get, post }),
    ...kvStore({ apiUrl }),
    ...kyc({ nabuUrl, get: http.get, post: http.post }),
    ...misc({ rootUrl, apiUrl, get, post }),
    ...profile({ nabuUrl, patch: http.patch, post: http.post }),
    ...sfox(),
    ...settings({ rootUrl, apiUrl, get, post }),
    ...shapeShift({ shapeShiftApiKey }),
    ...wallet({ rootUrl, apiUrl, get, post })
  }
}
