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

  const getBchTicker = () => get({
    url: apiUrl,
    endPoint: 'ticker',
    data: { base: 'BCH' }
  })

  const getBchUnspents = (fromAddresses, confirmations = 0) => get({
    url: rootUrl,
    endPoint: 'bch/unspent',
    data: {
      active: fromAddresses.join('|'),
      confirmations: Math.max(confirmations, -1),
      format: 'json'
    }
  })

  const pushBchTx = (txHex) => post({
    url: rootUrl,
    endPoint: 'bch/pushtx',
    data: { tx: txHex, format: 'plain' }
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
    getBchTicker,
    getBchUnspents,
    pushBchTx,
    getLatestBlock,
    getRawTx
  }
}
