import analytics from './analytics'
import apiAuthorize from './apiAuthorize'
import bch from './bch'
import bitpay from './bitpay'
import borrow from './borrow'
import btc from './btc'
import coin from './coin'
import custodial from './custodial'
import eth from './eth'
import httpService from './http'
import interest from './interest'
import kvStore from './kvStore'
import kyc from './kyc'
import lockbox from './lockbox'
import misc from './misc'
import profile from './profile'
import rates from './rates'
import settings from './settings'
import settingsComponent from './settingsComponent'
import simpleBuy from './simpleBuy'
import swap from './swap'
import trades from './trades'
import wallet from './wallet'
import xlm from './xlm'

const api = ({
  apiKey,
  getAuthCredentials,
  networks,
  options,
  reauthenticate
}: any = {}) => {
  const http = httpService({ apiKey })
  const authorizedHttp = apiAuthorize(http, getAuthCredentials, reauthenticate)
  const apiUrl = options.domains.api
  const bitpayUrl = options.domains.bitpay
  const everypayUrl = options.domains.everypay
  const horizonUrl = options.domains.horizon
  const ledgerUrl = options.domains.ledger
  const nabuUrl = `${apiUrl}/nabu-gateway`
  const rootUrl = options.domains.root

  return {
    ...analytics({ apiUrl, rootUrl, ...http }),
    ...bch({ apiUrl, ...http }),
    ...bitpay({ bitpayUrl }),
    ...borrow({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post
    }),
    ...btc({ rootUrl, apiUrl, ...http }),
    ...coin({ apiUrl, ...http }),
    ...custodial({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      ...http
    }),
    ...eth({ apiUrl, ...http }),
    ...kvStore({ apiUrl, networks, ...http }),
    ...kyc({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      ...http
    }),
    ...interest({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put
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
    ...settingsComponent({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      ...http
    }),
    ...simpleBuy({
      everypayUrl,
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      authorizedDelete: authorizedHttp.deleteRequest,
      ...http
    }),
    ...swap({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      ...http
    }),
    ...rates({ nabuUrl, ...authorizedHttp }),
    ...trades({ nabuUrl, ...authorizedHttp }),
    ...wallet({ rootUrl, ...http }),
    ...xlm({ apiUrl, horizonUrl, ...http })
  }
}

export default api

export type APIType = ReturnType<typeof analytics> &
  ReturnType<typeof borrow> &
  ReturnType<typeof bch> &
  ReturnType<typeof btc> &
  ReturnType<typeof coin> &
  ReturnType<typeof custodial> &
  ReturnType<typeof eth> &
  ReturnType<typeof interest> &
  ReturnType<typeof kyc> &
  ReturnType<typeof misc> &
  ReturnType<typeof profile> &
  ReturnType<typeof simpleBuy> &
  ReturnType<typeof swap> &
  ReturnType<typeof wallet> &
  ReturnType<typeof xlm>
