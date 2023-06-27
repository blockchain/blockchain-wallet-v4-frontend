import apiAuthorize from './apiAuthorize'
import bch from './bch'
import bitpay from './bitpay'
import btc from './btc'
import buySell from './buySell'
import coin from './coin'
import custodial from './custodial'
import debitCard from './debitCard'
import dex from './dex'
import earn from './earn'
import eth from './eth'
import experiments from './experiments'
import { makeFirebaseApp } from './firebase'
import httpService from './http'
import kvStore from './kvStore'
import kyc from './kyc'
import misc from './misc'
import networkConfig from './networkConfig'
import nfts from './nfts'
import profile from './profile'
import rates from './rates'
import referral from './referral'
import { makeRemoteConfigApi } from './remoteConfig'
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
  const firebaseApp = makeFirebaseApp()

  return {
    ...bch({ apiUrl, ...http }),
    ...bitpay({ bitpayUrl }),
    ...btc({ apiUrl, rootUrl, ...http }),
    ...coin({ apiUrl, ...http }),
    ...custodial({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
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
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      nabuUrl,
      ...http
    }),
    ...earn({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      nabuUrl
    }),
    ...eth({ apiUrl, openSeaApi, ...http }),
    ...experiments({
      authorizedGet: authorizedHttp.get,
      nabuUrl
    }),
    ...kvStore({ apiUrl, networks, ...http }),
    ...kyc({
      authorizedGet: authorizedHttp.get,
      authorizedPost: authorizedHttp.post,
      authorizedPut: authorizedHttp.put,
      nabuUrl,
      ...http
    }),
    ...misc({ apiUrl, ...http }),
    ...networkConfig({ apiUrl, authorizedGet: authorizedHttp.get }),
    ...nfts({ apiUrl, openSeaApi, ...http }),
    ...profile({
      apiUrl,
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
      authorizedPut: authorizedHttp.put,
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
    ...xlm({ apiUrl, horizonUrl, ...http }),
    ...makeRemoteConfigApi(firebaseApp)
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
  ReturnType<typeof earn> &
  ReturnType<typeof eth> &
  ReturnType<typeof kyc> &
  ReturnType<typeof misc> &
  ReturnType<typeof networkConfig> &
  ReturnType<typeof nfts> &
  ReturnType<typeof profile> &
  ReturnType<typeof referral> &
  ReturnType<typeof send> &
  ReturnType<typeof swap> &
  ReturnType<typeof taxCenter> &
  ReturnType<typeof wallet> &
  ReturnType<typeof xlm> &
  ReturnType<typeof makeRemoteConfigApi>
