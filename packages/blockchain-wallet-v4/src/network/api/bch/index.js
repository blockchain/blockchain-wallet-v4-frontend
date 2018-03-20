import { toUpper } from 'ramda'

export default ({ rootUrl, apiUrl, get, post }) => {
  const fetchBchData = (context, { n = 50, offset = 0, onlyShow = '' } = {}) => post({
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

  const getBchFee = () => {
    return Promise.resolve({ priority: 2, regular: 2 })
  }

  const getBchTicker = () => get({
    url: apiUrl,
    endPoint: 'ticker',
    data: { base: 'BCH' }
  })

  const getBchUnspents = (fromAddresses, confirmations = 0) => get({
    url: apiUrl,
    endPoint: 'bch/unspent',
    data: {
      active: fromAddresses.join('|'),
      confirmations: Math.max(confirmations, -1),
      format: 'json'
    }
  })

  const pushBchTx = (txHex) => post({
    url: apiUrl,
    endPoint: 'bch/pushtx',
    data: { tx: txHex, format: 'plain' }
  })

  const getBchFiatAtTime = (amount, currency, time) => get({
    url: apiUrl,
    endPoint: 'frombch',
    data: { value: amount, currency: toUpper(currency), time, textual: false, nosavecurrency: true }
  })

  const getLatestBlock = () => get({
    url: rootUrl,
    endPoint: 'bch/latestblock'
  })

  const getRawTx = (txHex) => get({
    url: rootUrl,
    endPoint: 'bch/rawtx/' + txHex
  })

  return {
    fetchBchData,
    getBchFee,
    getBchTicker,
    getBchUnspents,
    pushBchTx,
    getBchFiatAtTime,
    getLatestBlock,
    getRawTx
  }
}
