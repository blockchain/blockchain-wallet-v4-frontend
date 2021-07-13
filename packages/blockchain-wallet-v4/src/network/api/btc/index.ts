import { toUpper } from 'ramda'

export default ({ apiUrl, get, post, rootUrl }) => {
  const getBtcTicker = () =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: 'BTC' }
    })

  const getBtcUnspents = (fromAddresses, confirmations = 0, extras) =>
    post({
      url: rootUrl,
      endPoint: '/unspent',
      data: {
        active: fromAddresses.join('|'),
        activeBech32: extras ? extras.bech32 : null,
        confirmations: Math.max(confirmations, -1),
        format: 'json'
      }
    })

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

  const getBtcTransactionHistory = (
    active,
    activeBech32,
    currency,
    start,
    end
  ) => {
    const endpoint = '/v2/export-history'
    return post({
      url: rootUrl,
      endPoint: endpoint,
      data: { active, activeBech32, currency: toUpper(currency), start, end }
    })
  }

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
    getBtcTicker,
    getBtcUnspents,
    getBtcFees,
    getBtcTransactionHistory,
    pushBtcTx,
    getBtcFiatAtTime,
    getLatestBlock,
    getRawTx,
    getBalances
  }
}
