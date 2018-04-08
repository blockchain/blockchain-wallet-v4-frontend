export default ({ get, post }) => {
  const fetchBchData = (context, { n = 50, offset = 0, onlyShow = '' } = {}) => post({
    url: global.domains.api,
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
    url: global.domains.api,
    endPoint: 'ticker',
    data: { base: 'BCH' }
  })

  const getBchUnspents = (fromAddresses, confirmations = 0) => get({
    url: global.domains.api,
    endPoint: 'bch/unspent',
    data: {
      active: fromAddresses.join('|'),
      confirmations: Math.max(confirmations, -1),
      format: 'json'
    }
  })

  const pushBchTx = (txHex) => post({
    url: global.domains.api,
    endPoint: 'bch/pushtx',
    data: { tx: txHex, format: 'plain' }
  })

  return {
    fetchBchData,
    getBchTicker,
    getBchUnspents,
    pushBchTx
  }
}
