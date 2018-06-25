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
      data: onlyShow ? merge(data, { onlyShow }) : data
    })
  }

  const getBchFee = () => {
    // TODO :: this should come from wallet options
    return Promise.resolve({ priority: 2, regular: 2 })
  }

  const getBchTicker = () => get({
    url: apiUrl,
    endPoint: '/ticker',
    data: { base: 'BCH' }
  })

  const getBchUnspents = (fromAddresses, confirmations = 0) => get({
    url: apiUrl,
    endPoint: '/bch/unspent',
    data: {
      active: fromAddresses.join('|'),
      confirmations: Math.max(confirmations, -1),
      format: 'json'
    }
  })

  const pushBchTx = (txHex) => post({
    url: apiUrl,
    endPoint: '/bch/pushtx',
    data: { tx: txHex, format: 'plain' }
  })

  return {
    fetchBchData,
    getBchFee,
    getBchTicker,
    getBchUnspents,
    pushBchTx
  }
}
