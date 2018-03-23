// @flow
import { toUpper } from 'ramda'
import type {ApiContext} from '../index';

const api = ({ rootUrl, apiUrl, fetchFn }: ApiContext) => {
  const { get, getString, postString, post } = fetchFn
  const getBitcoinTicker = () => get({
    url: apiUrl,
    endPoint: 'ticker',
    data: { base: 'BTC' }
  })

  const getBitcoinUnspents = (fromAddresses: string[], confirmations: number = 0) => get({
    url: rootUrl,
    endPoint: 'unspent',
    data: {
      active: fromAddresses.join('|'),
      confirmations: Math.max(confirmations, -1),
      format: 'json'
    }
  })

  const getBitcoinFee = () => get({
    url: apiUrl,
    endPoint: 'mempool/fees'
  })

  const pushBitcoinTx = (txHex: string) => postString({
    url: rootUrl,
    endPoint: 'pushtx',
    data: { tx: txHex, format: 'plain' }
  })

  const getBitcoinFiatAtTime = (amount: number, currency: string, time: number) => get({
    url: apiUrl,
    endPoint: 'frombtc',
    data: { value: amount, currency: toUpper(currency), time, textual: false, nosavecurrency: true }
  })

  const getLatestBlock = () => get({
    url: rootUrl,
    endPoint: 'latestblock'
  })

  const getRawTx = (txHex: string) => get({
    url: rootUrl,
    endPoint: 'rawtx/' + txHex
  })

  const getBalances = (addresses: string[]) => post({
    url: rootUrl,
    endPoint: 'balance',
    data: {
      active: addresses.join('|'),
      format: 'json'
    }
  })

  return {
    getBitcoinTicker,
    getBitcoinUnspents,
    getBitcoinFee,
    pushBitcoinTx,
    getBitcoinFiatAtTime,
    getLatestBlock,
    getRawTx,
    getBalances
  }
}

export type BitcoinApi = $Call<typeof api, ApiContext>
export default api
