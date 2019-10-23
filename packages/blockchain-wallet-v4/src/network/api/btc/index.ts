import { equals, merge, toUpper } from 'ramda'
import { MultiaddrResponse } from './types'

export default ({ rootUrl, apiUrl, get, post }) => {
  const getBtcTicker = () =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: 'BTC' }
    })

  const getBtcUnspents = (fromAddresses, confirmations = 0) =>
    post({
      url: rootUrl,
      endPoint: '/unspent',
      data: {
        active: fromAddresses.join('|'),
        confirmations: Math.max(confirmations, -1),
        format: 'json'
      }
    })

  const getTransactionHistory = (coin, active, currency, start, end) => {
    const isBCH = equals(coin, 'BCH')
    const endpoint = '/v2/export-history'
    return post({
      url: isBCH ? apiUrl : rootUrl,
      endPoint: isBCH ? '/bch' + endpoint : endpoint,
      data: { active, currency: toUpper(currency), start, end }
    })
  }

  const fetchBtcData = (
    context: any,
    {
      n = 50,
      offset = 0,
      onlyShow
    }: { n: number; offset: number; onlyShow: any }
  ): Promise<MultiaddrResponse> => {
    const data = {
      active: (Array.isArray(context) ? context : [context]).join('|'),
      format: 'json',
      offset: offset,
      no_compact: true,
      ct: new Date().getTime(),
      n: n,
      language: 'en',
      no_buttons: true
    }
    return post({
      url: rootUrl,
      endPoint: '/multiaddr',
      data: onlyShow
        ? merge(data, {
            onlyShow: (Array.isArray(onlyShow) ? onlyShow : [onlyShow]).join(
              '|'
            )
          })
        : data
    })
  }

  const getBtcFees = () =>
    get({
      url: apiUrl,
      endPoint: '/mempool/fees'
    })

  const pushBtcTx = txHex =>
    post({
      url: rootUrl,
      endPoint: '/pushtx',
      data: { tx: txHex, format: 'plain' }
    })

  const getBtcFiatAtTime = (amount, currency, time) =>
    get({
      url: apiUrl,
      endPoint: '/frombtc',
      data: {
        value: amount,
        currency: toUpper(currency),
        time,
        textual: false,
        nosavecurrency: true
      }
    })

  const getLatestBlock = () =>
    get({
      url: rootUrl,
      endPoint: '/latestblock'
    })

  const getRawTx = txHex =>
    get({
      url: rootUrl,
      endPoint: '/rawtx/' + txHex,
      data: {
        format: 'hex',
        cors: 'true'
      }
    })

  const getBalances = addresses =>
    post({
      url: rootUrl,
      endPoint: '/balance',
      data: {
        active: addresses.join('|'),
        format: 'json'
      }
    })

  return {
    fetchBtcData,
    getBalances,
    getBtcFees,
    getBtcFiatAtTime,
    getBtcTicker,
    getBtcUnspents,
    getLatestBlock,
    getRawTx,
    getTransactionHistory,
    pushBtcTx
  }
}
