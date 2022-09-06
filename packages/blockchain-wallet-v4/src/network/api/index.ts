import apiAuthorize from './apiAuthorize'
import bch from './bch'
import bitpay from './bitpay'
import btc from './btc'
import buySell from './buySell'
import coin from './coin'
import custodial from './custodial'
import debitCard from './debitCard'
import dex from './dex'
import eth from './eth'
import httpService from './http'
import interest from './interest'
import kvStore from './kvStore'
import kyc from './kyc'
import misc from './misc'
import nfts from './nfts'
import profile from './profile'
import rates from './rates'
import referral from './referral'
import send from './send'
import settings from './settings'
import swap from './swap'
import taxCenter from './taxCenter'
import wallet from './wallet'
import xlm from './xlm'

const api = ({ apiKey, getAuthCredentials, networks, options, reauthenticate }: any = {}) => {
  const http = httpService({ apiKey })
  const authorizedHttp = apiAuthorize(http, getAuthCredentials, reauthenticate)
  const {
    api: apiUrl,
    bitpay: bitpayUrl,
    horizon: horizonUrl,
    opensea: openSeaApi,
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
      authorizedDelete: authorizedHttp.deleteRequest,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      nabuUrl,
      ...http
    }),
    ...dex({
      apiUrl,
      ...http
    }),
    ...eth({ apiUrl, openSeaApi, ...http }),
    ...kvStore({ apiUrl, networks, ...http }),
    ...kyc({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      nabuUrl,
      ...http
    }),
    ...interest({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      nabuUrl
    }),
    ...misc({ apiUrl, ...http }),
    ...nfts({ apiUrl, openSeaApi, ...http }),
    ...profile({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      nabuUrl,
      rootUrl,
      ...http
    }),
    ...referral({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      nabuUrl,
      ...http
    }),
    ...send({ apiUrl, ...http }),
    ...settings({ authorizedPut: authorizedHttp.put, nabuUrl, rootUrl, ...http }),
    ...buySell({
      authorizedDelete: authorizedHttp.deleteRequest,
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
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
    ...taxCenter({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      nabuUrl
    }),
    ...wallet({ rootUrl, ...http }),
    ...xlm({ apiUrl, horizonUrl, ...http })
  }
}

export default api

export type APIType = ReturnType<typeof bch> &
  ReturnType<typeof btc> &
  ReturnType<typeof buySell> &
  ReturnType<typeof coin> &
  ReturnType<typeof custodial> &
  ReturnType<typeof debitCard> &
  ReturnType<typeof dex> &
  ReturnType<typeof eth> &
  ReturnType<typeof interest> &
  ReturnType<typeof kyc> &
  ReturnType<typeof misc> &
  ReturnType<typeof nfts> &
  ReturnType<typeof profile> &
  ReturnType<typeof referral> &
  ReturnType<typeof send> &
  ReturnType<typeof swap> &
  ReturnType<typeof taxCenter> &
  ReturnType<typeof wallet> &
  ReturnType<typeof xlm>
