import analytics from './analytics'
import bch from './bch'
import btc from './btc'
import bsv from './bsv'
import delegate from './delegate'
import eth from './eth'
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
import httpService from './http'
import apiAuthorize from './apiAuthorize'

export default ({
  options,
  apiKey,
  getAuthCredentials,
  reauthenticate,
  networks
} = {}) => {
  const http = httpService({ apiKey })
  const authorizedHttp = apiAuthorize(http, getAuthCredentials, reauthenticate)
  const apiUrl = options.domains.api
  const horizonUrl = options.domains.horizon
  const ledgerUrl = options.domains.ledger
  const nabuUrl = `${apiUrl}/nabu-gateway`
  const rootUrl = options.domains.root
  const shapeShiftApiKey = options.platforms.web.shapeshift.config.apiKey

  return {
    ...analytics({ rootUrl, apiUrl, ...http }),
    ...bch({ rootUrl, apiUrl, ...http }),
    ...btc({ rootUrl, apiUrl, ...http }),
    ...bsv({ rootUrl, apiUrl, ...http }),
    ...delegate({ rootUrl, apiUrl, ...http }),
    ...eth({ rootUrl, apiUrl, ...http }),
    ...kvStore({ apiUrl, networks, ...http }),
    ...kyc({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      ...http
    }),
    ...lockbox({ ledgerUrl, ...http }),
    ...misc({ rootUrl, apiUrl, ...http }),
    ...profile({
      rootUrl,
      nabuUrl,
      authorizedPut: authorizedHttp.put,
      authorizedGet: authorizedHttp.get,
      ...http
    }),
    ...sfox(),
    ...settings({ rootUrl, ...http }),
    ...shapeShift({ shapeShiftApiKey, ...http }),
    ...rates({ nabuUrl, ...authorizedHttp }),
    ...trades({ nabuUrl, ...authorizedHttp }),
    ...wallet({ rootUrl, apiUrl, ...http }),
    ...xlm({ apiUrl, horizonUrl, network: networks.xlm, ...http })
  }
}
