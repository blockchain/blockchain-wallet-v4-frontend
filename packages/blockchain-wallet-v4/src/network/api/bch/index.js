import { merge } from 'ramda'

export default ({ rootUrl, apiUrl, get, post }) => {
  const fetchBchData = (context, { n = 50, offset = 0, onlyShow } = {}) => {
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

  const getBchFee = () => {
    return Promise.resolve({ priority: 5, regular: 4 })
  }

  const getBchTicker = () =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: 'BCH' }
    })

  const getBchUnspents = (fromAddresses, confirmations = 0) =>
    get({
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

  return {
    fetchBchData,
    getBchFee,
    getBchTicker,
    getBchUnspents,
    getBchRawTx,
    getBchDust,
    pushBchTx
  }
}
