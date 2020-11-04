import analytics from './analytics'
import apiAuthorize from './apiAuthorize'
import bch from './bch'
import bitpay from './bitpay'
import borrow from './borrow'
import btc from './btc'
import coin from './coin'
import custodial from './custodial'
import eligible from './eligible'
import eth from './eth'
import httpService from './http'
import interest from './interest'
import kvStore from './kvStore'
import kyc from './kyc'
import lockbox from './lockbox'
import misc from './misc'
import profile from './profile'
import rates from './rates'
import sdd from './sdd'
import settings from './settings'
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
    ...eligible({
      nabuUrl,
      authorizedGet: authorizedHttp.get
    }),
    ...eth({ apiUrl, ...http }),
    ...kvStore({ apiUrl, networks, ...http }),
    ...kyc({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      ...http
    }),
    ...interest({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post
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
    ...sdd({
      nabuUrl,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post
    }),
    ...settings({ rootUrl, ...http }),
    ...simpleBuy({
      everypayUrl,
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
  ReturnType<typeof misc> &
  ReturnType<typeof profile> &
  ReturnType<typeof sdd> &
  ReturnType<typeof simpleBuy> &
  ReturnType<typeof wallet> &
  ReturnType<typeof xlm>
