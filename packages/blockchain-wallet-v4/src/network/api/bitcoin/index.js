import { toUpper } from 'ramda'

export default ({ get, post }) => {
  const getBitcoinTicker = () => get({
    url: global.domains.api,
    endPoint: 'ticker',
    data: { base: 'BTC' }
  })

  const getBitcoinUnspents = (fromAddresses, confirmations = 0) => get({
    url: global.domains.root,
    endPoint: 'unspent',
    data: {
      active: fromAddresses.join('|'),
      confirmations: Math.max(confirmations, -1),
      format: 'json'
    }
  })

  const getBitcoinFee = () => get({
    url: global.domains.api,
    endPoint: 'mempool/fees'
  })

  const pushBitcoinTx = (txHex) => post({
    url: global.domains.root,
    endPoint: 'pushtx',
    data: { tx: txHex, format: 'plain' }
  })

  const getBitcoinFiatAtTime = (amount, currency, time) => get({
    url: global.domains.api,
    endPoint: 'frombtc',
    data: { value: amount, currency: toUpper(currency), time, textual: false, nosavecurrency: true }
  })

  const getLatestBlock = () => get({
    url: global.domains.root,
    endPoint: 'latestblock'
  })

  const getRawTx = (txHex) => get({
    url: global.domains.root,
    endPoint: 'rawtx/' + txHex
  })

  const getBalances = (addresses) => post({
    url: global.domains.root,
    endPoint: 'balance',
    data: {
      active: addresses.join('|'),
      format: 'json'
    }
  })

  return {
    getBitcoinTicker,
    getBitcoinUnspents,
    getBitcoinFee,
    pushBitcoinTx,
    getBitcoinFiatAtTime,
    getLatestBlock,
    getRawTx,
    getBalances
  }
}
