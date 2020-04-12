import analytics from './analytics'
import apiAuthorize from './apiAuthorize'
import bch from './bch'
import bitpay from './bitpay'
import borrow from './borrow'
import btc from './btc'
import eth from './eth'
import httpService from './http'
import kvStore from './kvStore'
import kyc from './kyc'
import lockbox from './lockbox'
import misc from './misc'
import profile from './profile'
import rates from './rates'
import settings from './settings'
import shapeShift from './shapeShift'
import simpleBuy from './simpleBuy'
import trades from './trades'
import wallet from './wallet'
import xlm from './xlm'

const api = ({
  options,
  apiKey,
  getAuthCredentials,
  reauthenticate,
  networks
}: any = {}) => {
  const http = httpService({ apiKey })
  const authorizedHttp = apiAuthorize(http, getAuthCredentials, reauthenticate)
  const apiUrl = options.domains.api
  const bitpayUrl = options.domains.bitpay
  const horizonUrl = options.domains.horizon
  const ledgerUrl = options.domains.ledger
  const nabuUrl = `${apiUrl}/nabu-gateway`
  const rootUrl = options.domains.root
  const shapeShiftApiKey = options.platforms.web.shapeshift.config.apiKey
  return {
    ...analytics({ rootUrl, ...http }),
    ...bch({ apiUrl, ...http }),
    ...bitpay({ bitpayUrl }),
    ...borrow({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post
    }),
    ...btc({ rootUrl, apiUrl, ...http }),
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
    ...settings({ rootUrl, ...http }),
    ...shapeShift({ shapeShiftApiKey, ...http }),
    ...simpleBuy({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      authorizedDelete: authorizedHttp.deleteRequest,
      ...http
    }),
    ...rates({ nabuUrl, ...authorizedHttp }),
    ...trades({ nabuUrl, ...authorizedHttp }),
    ...wallet({ rootUrl, ...http }),
    ...xlm({ apiUrl, horizonUrl, network: networks.xlm, ...http })
  }
}

export default api

export type APIType = ReturnType<typeof borrow> &
  ReturnType<typeof bch> &
  ReturnType<typeof btc> &
  ReturnType<typeof misc> &
  ReturnType<typeof simpleBuy> &
  ReturnType<typeof wallet> &
  ReturnType<typeof xlm>
