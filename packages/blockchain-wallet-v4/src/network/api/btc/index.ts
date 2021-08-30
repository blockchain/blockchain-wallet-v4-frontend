import { toUpper } from 'ramda'

export default ({ apiUrl, get, post, rootUrl }) => {
  const getBtcTicker = () =>
    get({
      data: { base: 'BTC' },
      endPoint: '/ticker',
      url: apiUrl
    })

  const getBtcUnspents = (fromAddresses, confirmations = 0, extras) =>
    post({
      data: {
        active: fromAddresses.join('|'),
        activeBech32: extras ? extras.bech32 : null,
        confirmations: Math.max(confirmations, -1),
        format: 'json'
      },
      endPoint: '/unspent',
      url: rootUrl
    })

  const getBtcFees = () =>
    get({
      endPoint: '/mempool/fees',
      url: apiUrl
    })

  const pushBtcTx = (txHex) =>
    post({
      data: { format: 'plain', tx: txHex },
      endPoint: '/pushtx',
      url: rootUrl
    })

  const getBtcFiatAtTime = (amount, currency, time) =>
    get({
      data: {
        currency: toUpper(currency),
        nosavecurrency: true,
        textual: false,
        time,
        value: amount
      },
      endPoint: '/frombtc',
      url: apiUrl
    })

  const getBtcTransactionHistory = (active, activeBech32, currency, start, end) => {
    const endpoint = '/v2/export-history'
    return post({
      data: { active, activeBech32, currency: toUpper(currency), end, start },
      endPoint: endpoint,
      url: rootUrl
    })
  }

  const getLatestBlock = () =>
    get({
      endPoint: '/latestblock',
      url: rootUrl
    })

  const getRawTx = (txHex) =>
    get({
      data: {
        cors: 'true',
        format: 'hex'
      },
      endPoint: `/rawtx/${txHex}`,
      url: rootUrl
    })

  const getBalances = (addresses) =>
    post({
      data: {
        active: addresses.join('|'),
        format: 'json'
      },
      endPoint: '/balance',
      url: rootUrl
    })

  return {
    getBalances,
    getBtcFees,
    getBtcFiatAtTime,
    getBtcTicker,
    getBtcTransactionHistory,
    getBtcUnspents,
    getLatestBlock,
    getRawTx,
    pushBtcTx
  }
}
