// TODO: TypeScript remove this entire file?
import analytics from './analytics'
import bch from './bch'
import bitpay from './bitpay'
import coinify from './coinify'
import delegate from './delegate'
import eth from './eth'
import kvStore from './kvStore'
import kyc from './kyc'
import lockbox from './lockbox'
import misc from './misc/index.ts'
import profile from './profile'
import rates from './rates'
import settings from './settings'
import shapeShift from './shapeShift'
import sfox from './sfox'
import trades from './trades'
import wallet from './wallet/index.ts'
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
  const bitpayUrl = options.domains.bitpay
  const coinifyUrl = options.domains.coinify
  const horizonUrl = options.domains.horizon
  const ledgerUrl = options.domains.ledger
  const nabuUrl = `${apiUrl}/nabu-gateway`
  const rootUrl = options.domains.root
  const shapeShiftApiKey = options.platforms.web.shapeshift.config.apiKey
  return {
    ...analytics({ rootUrl, ...http }),
    ...bch({ rootUrl, apiUrl, ...http }),
    ...bitpay({ bitpayUrl }),
    ...coinify({ coinifyUrl, ...http }),
    ...delegate({ rootUrl, apiUrl, ...http }),
    ...eth({ rootUrl, apiUrl, ...http }),
    ...kvStore({ apiUrl, networks, ...http }),
    ...kyc({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      ...http
    }),
    ...lockbox({ ledgerUrl, ...http }),
    ...misc({ rootUrl, apiUrl, ...http }),
    ...profile({
      rootUrl,
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      ...http
    }),
    ...sfox(),
    ...settings({ rootUrl, ...http }),
    ...shapeShift({ shapeShiftApiKey, ...http }),
    ...rates({ nabuUrl, ...authorizedHttp }),
    ...trades({ nabuUrl, ...authorizedHttp }),
    ...wallet({ rootUrl, ...http }),
    ...xlm({ apiUrl, horizonUrl, network: networks.xlm, ...http })
  }
}
