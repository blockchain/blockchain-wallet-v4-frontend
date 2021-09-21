import { merge, toUpper } from 'ramda'

export default ({ apiUrl, get, post }) => {
  const fetchBchData = (
    context,
    { n = 50, offset = 0, onlyShow = false } = {},
    filter?: Number
  ) => {
    const data = {
      active: (Array.isArray(context) ? context : [context]).join('|'),
      ct: new Date().getTime(),
      filter,
      format: 'json',
      language: 'en',
      n,
      no_buttons: true,
      no_compact: true,
      offset
    }
    return post({
      data: onlyShow
        ? merge(data, {
            onlyShow: (Array.isArray(onlyShow) ? onlyShow : [onlyShow]).join('|')
          })
        : data,
      endPoint: '/bch/multiaddr',
      url: apiUrl
    })
  }

  const getBchTransactionHistory = (active, currency, start, end) => {
    return post({
      data: { active, currency: toUpper(currency), end, start },
      endPoint: '/bch/v2/export-history',
      url: apiUrl
    })
  }
  const getBchUnspents = (fromAddresses, confirmations = 0) =>
    post({
      data: {
        active: fromAddresses.join('|'),
        confirmations: Math.max(confirmations, -1),
        format: 'json'
      },
      endPoint: '/bch/unspent',
      url: apiUrl
    })

  const pushBchTx = (tx, lock_secret) =>
    post({
      data: { format: 'plain', lock_secret, tx },
      endPoint: '/bch/pushtx',
      url: apiUrl
    })

  const getBchRawTx = (txHex) =>
    get({
      data: {
        cors: 'true',
        format: 'hex'
      },
      endPoint: `/bch/rawtx/${txHex}`,
      url: apiUrl
    })

  const getBchDust = () =>
    get({
      endPoint: '/bch/dust',
      url: apiUrl
    })

  const getBchFees = () =>
    get({
      endPoint: '/mempool/fees/bch',
      url: apiUrl
    })

  return {
    fetchBchData,
    getBchDust,
    getBchFees,
    getBchRawTx,
    getBchTransactionHistory,
    getBchUnspents,
    pushBchTx
  }
}
