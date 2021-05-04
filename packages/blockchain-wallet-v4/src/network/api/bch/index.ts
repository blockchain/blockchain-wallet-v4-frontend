import { merge, toUpper } from 'ramda'

export default ({ apiUrl, get, post }) => {
  const fetchBchData = (
    context,
    { n = 50, offset = 0, onlyShow = false } = {},
    filter?: Number
  ) => {
    const data = {
      active: (Array.isArray(context) ? context : [context]).join('|'),
      format: 'json',
      offset: offset,
      no_compact: true,
      ct: new Date().getTime(),
      n: n,
      language: 'en',
      no_buttons: true,
      filter: filter
    }
    return post({
      url: apiUrl,
      endPoint: '/bch/multiaddr',
      data: onlyShow
        ? merge(data, {
            onlyShow: (Array.isArray(onlyShow) ? onlyShow : [onlyShow]).join(
              '|'
            )
          })
        : data
    })
  }

  const getBchTicker = () =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: 'BCH' }
    })

  const getBchTransactionHistory = (active, currency, start, end) => {
    return post({
      url: apiUrl,
      endPoint: '/bch/v2/export-history',
      data: { active, currency: toUpper(currency), start, end }
    })
  }
  const getBchUnspents = (fromAddresses, confirmations = 0) =>
    post({
      url: apiUrl,
      endPoint: '/bch/unspent',
      data: {
        active: fromAddresses.join('|'),
        confirmations: Math.max(confirmations, -1),
        format: 'json'
      }
    })

  const pushBchTx = (tx, lock_secret) =>
    post({
      url: apiUrl,
      endPoint: '/bch/pushtx',
      data: { tx, lock_secret, format: 'plain' }
    })

  const getBchRawTx = txHex =>
    get({
      url: apiUrl,
      endPoint: '/bch/rawtx/' + txHex,
      data: {
        format: 'hex',
        cors: 'true'
      }
    })

  const getBchDust = () =>
    get({
      url: apiUrl,
      endPoint: '/bch/dust'
    })

  const getBchFees = () =>
    get({
      url: apiUrl,
      endPoint: '/mempool/fees/bch'
    })

  return {
    fetchBchData,
    getBchDust,
    getBchFees,
    getBchRawTx,
    getBchTicker,
    getBchTransactionHistory,
    getBchUnspents,
    pushBchTx
  }
}
