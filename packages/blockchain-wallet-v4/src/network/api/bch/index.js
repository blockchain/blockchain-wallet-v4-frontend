// @flow
import { toUpper } from 'ramda'
import type {ApiContext} from "../index";

const api = ({ rootUrl, apiUrl, fetchFn }: ApiContext) => {
  const { get, post, getString, postString } = fetchFn
  const fetchBchData = (context: any, { n = 50, offset = 0, onlyShow = '' }: any = {}) => post({
    url: apiUrl,
    endPoint: 'bch/multiaddr',
    data: {
      active: (Array.isArray(context) ? context : [context]).join('|'),
      onlyShow: onlyShow,
      format: 'json',
      offset: offset,
      no_compact: true,
      ct: new Date().getTime(),
      n: n,
      language: 'en',
      no_buttons: true
    }
  })

  const getBchTicker = () => get({
    url: apiUrl,
    endPoint: 'ticker',
    data: { base: 'BCH' }
  })

  const getBchUnspents = (fromAddresses: string[], confirmations: number = 0) => get({
    url: rootUrl,
    endPoint: 'bch/unspent',
    data: {
      active: fromAddresses.join('|'),
      confirmations: Math.max(confirmations, -1),
      format: 'json'
    }
  })

  const pushBchTx = (txHex: string) => postString({
    url: rootUrl,
    endPoint: 'bch/pushtx',
    data: { tx: txHex, format: 'plain' }
  })

  const getBchFiatAtTime = (amount: number, currency: string, time: number) => getString({
    url: apiUrl,
    endPoint: 'frombch',
    data: { value: amount, currency: toUpper(currency), time, textual: false, nosavecurrency: true }
  })

  const getLatestBlock = () => get({
    url: rootUrl,
    endPoint: 'bch/latestblock'
  })

  const getRawTx = (txHex: string) => get({
    url: rootUrl,
    endPoint: 'bch/rawtx/' + txHex
  })

  return {
    fetchBchData,
    getBchTicker,
    getBchUnspents,
    pushBchTx,
    getBchFiatAtTime,
    getLatestBlock,
    getRawTx
  }
}

export type BchApi = $Call<typeof api, ApiContext>
export default api