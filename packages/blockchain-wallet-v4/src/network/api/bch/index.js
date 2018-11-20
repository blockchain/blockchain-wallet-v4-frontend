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
    // TODO :: this should come from wallet options
    return Promise.resolve({ priority: 2, regular: 2 })
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
    Promise.resolve({
      tx_hash:
        'fd208b67abd52eb417cce9a1886f29342e3577a4d1f9c87fbb11ca21e6fc3a81',
      tx_hash_big_endian:
        '813afce621ca11bb7fc8f9d1a477352e34296f88a1e9cc17b42ed5ab678b20fd',
      tx_index: 0,
      tx_output_n: 26,
      script: '00',
      value: 546,
      value_hex: '00000222',
      confirmations: 1,
      output_script: '76a914757666a692b3676fef9df7d0f61d415012555f6288ac',
      lock_secret: 'b812995e2ca64c69bdd9187f2c26ab3b'
    })
  // get({
  //   url: apiUrl,
  //   endpoint: '/bch/dust'
  // })

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
