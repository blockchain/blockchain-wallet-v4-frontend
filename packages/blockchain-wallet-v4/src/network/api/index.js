import analytics from './analytics'
import bitcoin from './btc'
import delegate from './delegate'
import ethereum from './eth'
import bch from './bch'
import kvStore from './kvStore'
import kyc from './kyc'
import lockbox from './lockbox'
import misc from './misc'
import profile from './profile'
import rates from './rates'
import settings from './settings'
import shapeShift from './shapeShift'
import sfox from './sfox'
import trades from './trades'
import wallet from './wallet'
import xlm from './xlm'
import fetchService from './fetch'
import httpService from './http'
import apiAuthorize from './apiAuthorize'

export default ({ options, apiKey, getAuthCredentials, networks } = {}) => {
  const { get, post } = fetchService({ apiKey })
  const http = httpService({ apiKey })
  const authorizedHttp = apiAuthorize(http, getAuthCredentials)
  const apiUrl = options.domains.api
  const horizonUrl = options.domains.horizon
  const ledgerUrl = options.domains.ledger
  const nabuUrl = `${apiUrl}/nabu-gateway`
  const rootUrl = options.domains.root
  const shapeShiftApiKey = options.platforms.web.shapeshift.config.apiKey

  return {
    ...analytics({ rootUrl, apiUrl, get, post }),
    ...bitcoin({ rootUrl, apiUrl, get, post }),
    ...delegate({ rootUrl, apiUrl, get, post }),
    ...ethereum({ rootUrl, apiUrl, get, post }),
    ...bch({ rootUrl, apiUrl, get, post }),
    ...kvStore({ apiUrl, networks }),
    ...kyc({
      nabuUrl,
      get: http.get,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post
    }),
    ...lockbox({ ledgerUrl, get, post }),
    ...misc({ rootUrl, apiUrl, get, post }),
    ...profile({
      rootUrl,
      nabuUrl,
      authorizedPut: authorizedHttp.put,
      authorizedGet: authorizedHttp.get,
      get: http.get,
      post: http.post
    }),
    ...sfox(),
    ...settings({ rootUrl, apiUrl, get, post }),
    ...shapeShift({ shapeShiftApiKey, ...http }),
    ...rates({ nabuUrl, ...authorizedHttp }),
    ...trades({ nabuUrl, ...authorizedHttp }),
    ...wallet({ rootUrl, apiUrl, get, post }),
    ...xlm({ get: http.get, horizonUrl, network: networks.xlm })
  }
}
