import * as StellarSDK from 'stellar-sdk'

import { CoinType, EthRawTxType, XlmTxType } from 'core/types'
import { merge, prop } from 'ramda'
import { RawBtcTxResponseType } from './types'

export default ({ apiUrl, rootUrl, horizonUrl, get, post }) => {
  const getCoinTicker = (coin: CoinType) =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: coin }
    })

  function getCoinTxs(params: {
    address: Array<string> | string
    coin: 'BTC' | 'BCH'
    offset: number
    onlyShow: Array<string> | string
    pageSize: number
  }): RawBtcTxResponseType
  function getCoinTxs(params: {
    address: string
    coin: 'PAX' | 'USDT'
    page: number
    pageSize: number
    tokenAddr: string
  }): EthRawTxType
  function getCoinTxs(params: {
    address: string
    coin: 'ETH'
    page: number
    pageSize: number
  }): EthRawTxType
  function getCoinTxs(params: {
    coin: 'XLM'
    limit?: number
    order?: 'asc' | 'desc'
    pagingToken?: string
    publicKey: string
    reset?: boolean
  }): XlmTxType
  function getCoinTxs (
    params:
      | {
          address: Array<string> | string
          coin: 'BTC' | 'BCH'
          offset: number
          onlyShow: Array<string> | string
          pageSize: number
        }
      | {
          address: string
          coin: 'PAX' | 'USDT'
          page: number
          pageSize: number
          tokenAddr: string
        }
      | {
          address: string
          coin: 'ETH'
          page: number
          pageSize: number
        }
      | {
          coin: 'XLM'
          limit?: number
          order?: 'asc' | 'desc'
          pagingToken?: string
          publicKey: string
          reset?: boolean
        }
  ): RawBtcTxResponseType | EthRawTxType | XlmTxType {
    switch (params.coin) {
      case 'BTC':
      case 'BCH':
        const endPoint = params.coin === 'BCH' ? '/bch/multiaddr' : '/multiaddr'
        const data = {
          active: (Array.isArray(params.address)
            ? params.address
            : [params.address]
          ).join('|'),
          format: 'json',
          offset: params.offset,
          no_compact: true,
          ct: new Date().getTime(),
          n: params.pageSize,
          language: 'en',
          no_buttons: true
        }
        return post({
          url: rootUrl,
          endPoint,
          data: params.onlyShow
            ? merge(data, {
                onlyShow: (Array.isArray(params.onlyShow)
                  ? params.onlyShow
                  : [params.onlyShow]
                ).join('|')
              })
            : data
        }) as RawBtcTxResponseType
      case 'PAX':
      case 'USDT':
        return get({
          url: apiUrl,
          endPoint: `/v2/eth/data/account/${params.address}/token/${params.tokenAddr}/transfers`,
          data: { page: params.page, size: params.pageSize }
        })
      case 'ETH':
        return get({
          url: apiUrl,
          endPoint: `/v2/eth/data/account/${params.address}/transactions`,
          data: { page: params.page, size: params.pageSize }
        })
      case 'XLM':
        const server = new StellarSDK.Server(horizonUrl)
        const txCallBuilder = server
          .transactions()
          .forAccount(params.publicKey)
          .order(params.order || 'desc')

        if (params.pagingToken && !params.reset)
          txCallBuilder.cursor(params.pagingToken)
        if (params.limit) txCallBuilder.limit(params.limit)

        // @ts-ignore
        return txCallBuilder.call().then(prop('records'))
    }
  }

  return {
    getCoinTicker,
    getCoinTxs
  }
}
