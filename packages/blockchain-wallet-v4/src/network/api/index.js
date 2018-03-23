// @flow
import bitcoin from './bitcoin'
import delegate from './delegate'
import ethereum from './ethereum'
import bch from './bch'
import kvStore from './kvStore'
import misc from './misc'
import options from './options'
import settings from './settings'
import shapeShift from './shapeShift'
import sfox from './sfox'
import wallet from './wallet'
import fetchService from './fetch'

import type {Request, RequestFn} from './fetch'
import type {BitcoinApi} from './bitcoin'
import type {BchApi} from './bch'
import type {DelegateApi} from './delegate'

export type ApiContext = {|
  rootUrl: string,
  apiUrl: string,
  fetchFn: RequestFn
|}

// TODO it should be possible to do that with $Call<typeof bitcoin, ApiContext> somehow, but it just reports as empty
// Maybe we don't need to declare this type but similarly just export typeof further on the bottom
export type Api = {
  ...BitcoinApi,
  ...BchApi,
  ...DelegateApi
}

export const BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_BLOCKCHAIN_INFO = 'https://api.blockchain.info/'
export const API_CODE = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'

export const SHAPESHIFT_IO = 'https://shapeshift.io/'
export const SHAPESHIFT_API_KEY = 'b7a7c320c19ea3a8e276c8921bc3ff79ec064d2cd9d98ab969acc648246b4be5ab2379af704c5d3a3021c0ddf82b3e479590718847c1301e1a85331d2d2a8370'

export default ({ rootUrl = BLOCKCHAIN_INFO, apiUrl = API_BLOCKCHAIN_INFO, apiCode = API_CODE, shapeShiftRootUrl = SHAPESHIFT_IO, shapeShiftApiKey = SHAPESHIFT_API_KEY }: any = {}) => {
  let fetchFn = fetchService(apiCode)
  const { get, post }: RequestFn = fetchFn

  let apiContext: ApiContext = {rootUrl, apiUrl, fetchFn}

  return ({
    ...bitcoin(apiContext),
    ...bch(apiContext),
    ...delegate(apiContext),

    ...ethereum({ rootUrl, apiUrl, get, post }),
    ...kvStore({ apiUrl }),
    ...misc({ rootUrl, apiUrl, get, post }),
    ...options({ rootUrl, apiUrl, get, post }),
    ...sfox({ rootUrl }),
    ...settings({ rootUrl, apiUrl, get, post }),
    ...shapeShift({ shapeShiftRootUrl, shapeShiftApiKey }),
    ...wallet({ rootUrl, apiUrl, get, post })
  }: Api)
}
