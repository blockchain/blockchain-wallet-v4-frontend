import apiAuthorize from './apiAuthorize'
import bch from './bch'
import bitpay from './bitpay'
import btc from './btc'
import buySell from './buySell'
import coin from './coin'
import custodial from './custodial'
import debitCard from './debitCard'
import eth from './eth'
import httpService from './http'
import interest from './interest'
import kvStore from './kvStore'
import kyc from './kyc'
import lockbox from './lockbox'
import misc from './misc'
import nfts from './nfts'
import profile from './profile'
import rates from './rates'
import send from './send'
import settings from './settings'
import swap from './swap'
import wallet from './wallet'
import xlm from './xlm'

const api = ({ apiKey, getAuthCredentials, networks, options, reauthenticate }: any = {}) => {
  const http = httpService({ apiKey })
  const authorizedHttp = apiAuthorize(http, getAuthCredentials, reauthenticate)
  const {
    api: apiUrl,
    bitpay: bitpayUrl,
    everypay: everypayUrl,
    horizon: horizonUrl,
    ledger: ledgerUrl,
    opensea: openseaApi,
    root: rootUrl
  } = options.domains
  const nabuUrl = `${apiUrl}/nabu-gateway`

  return {
    ...bch({ apiUrl, ...http }),
    ...bitpay({ bitpayUrl }),
    ...btc({ apiUrl, rootUrl, ...http }),
    ...coin({ apiUrl, ...http }),
    ...custodial({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      nabuUrl,
      ...http
    }),
    ...debitCard({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      nabuUrl,
      ...http
    }),
    ...eth({ apiUrl, openseaApi, ...http }),
    ...kvStore({ apiUrl, networks, ...http }),
    ...kyc({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      nabuUrl,
      ...http
    }),
    ...interest({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      nabuUrl
    }),
    ...lockbox({ ledgerUrl, ...http }),
    ...misc({ apiUrl, ...http }),
    ...nfts({ apiUrl, openseaApi, ...http }),
    ...profile({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      nabuUrl,
      rootUrl,
      ...http
    }),
    ...send({ apiUrl, ...http }),
    ...settings({ rootUrl, ...http }),
    ...buySell({
      authorizedDelete: authorizedHttp.deleteRequest,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      everypayUrl,
      nabuUrl,
      ...http
    }),
    ...swap({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      nabuUrl,
      ...http
    }),
    ...rates({ nabuUrl, ...authorizedHttp }),
    ...wallet({ rootUrl, ...http }),
    ...xlm({ apiUrl, horizonUrl, ...http })
  }
}

export default api

export type APIType = ReturnType<typeof bch> &
  ReturnType<typeof btc> &
  ReturnType<typeof coin> &
  ReturnType<typeof custodial> &
  ReturnType<typeof debitCard> &
  ReturnType<typeof eth> &
  ReturnType<typeof interest> &
  ReturnType<typeof kyc> &
  ReturnType<typeof misc> &
  ReturnType<typeof nfts> &
  ReturnType<typeof profile> &
  ReturnType<typeof buySell> &
  ReturnType<typeof send> &
  ReturnType<typeof swap> &
  ReturnType<typeof wallet> &
  ReturnType<typeof xlm>
