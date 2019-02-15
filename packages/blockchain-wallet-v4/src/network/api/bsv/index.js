import { merge } from 'ramda'

export default ({ rootUrl, apiUrl, get, post }) => {
  const fetchBsvData = (context, { n = 50, offset = 0, onlyShow } = {}) => {
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
      endPoint: '/bsv/multiaddr',
      data: onlyShow
        ? merge(data, {
            onlyShow: (Array.isArray(onlyShow) ? onlyShow : [onlyShow]).join(
              '|'
            )
          })
        : data
    })
  }

  const getBsvFee = () => {
    return Promise.resolve({ priority: 5, regular: 4 })
  }

  const getBsvTicker = () =>
    get({
      url: apiUrl,
      endPoint: '/ticker',
      data: { base: 'BSV' }
    })

  const getBsvUnspents = (fromAddresses, confirmations = 0) =>
    get({
      url: apiUrl,
      endPoint: '/bsv/unspent',
      data: {
        active: fromAddresses.join('|'),
        confirmations: Math.max(confirmations, -1),
        format: 'json'
      }
    })

  const pushBsvTx = (tx, lock_secret) =>
    post({
      url: apiUrl,
      endPoint: '/bsv/pushtx',
      data: { tx, lock_secret, format: 'plain' }
    })

  const getBsvRawTx = txHex =>
    get({
      url: apiUrl,
      endPoint: '/bsv/rawtx/' + txHex,
      data: {
        format: 'hex',
        cors: 'true'
      }
    })

  const getBsvDust = () =>
    get({
      url: apiUrl,
      endPoint: '/bsv/dust'
    })

  return {
    fetchBsvData,
    getBsvFee,
    getBsvTicker,
    getBsvUnspents,
    getBsvRawTx,
    getBsvDust,
    pushBsvTx
  }
}
