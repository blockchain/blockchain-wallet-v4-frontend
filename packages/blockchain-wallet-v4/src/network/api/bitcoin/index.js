import { toUpper } from 'ramda'
import Task from 'data.task'

export default ({ rootUrl, apiUrl, get, post }) => {
  const getBitcoinTicker = () => get({
    url: apiUrl,
    endPoint: 'ticker',
    data: { base: 'BTC' }
  })

  const getBitcoinUnspents = (fromAddresses, confirmations = 0) => get({
    url: rootUrl,
    endPoint: 'unspent',
    data: {
      active: fromAddresses.join('|'),
      confirmations: Math.max(confirmations, -1),
      format: 'json'
    }
  })

  const getBitcoinFee = () => get({
    url: apiUrl,
    endPoint: 'mempool/fees'
  })

  const pushBitcoinTx = (txHex) => post({
    url: rootUrl,
    endPoint: 'pushtx',
    data: { tx: txHex, format: 'plain' }
  })
  // const pushBitcoinTx = (txHex) => {
  //   console.log(txHex)
  //   return Promise.resolve(txHex)
  // }

  const getBitcoinFiatAtTime = (amount, currency, time) => get({
    url: apiUrl,
    endPoint: 'frombtc',
    data: { value: amount, currency: toUpper(currency), time, textual: false, nosavecurrency: true }
  })

  const getLatestBlock = () => get({
    url: rootUrl,
    endPoint: 'latestblock'
  })

  const getRawTx = (txHex) => get({
    url: rootUrl,
    endPoint: 'rawtx/' + txHex
  })

  const getBalances = (addresses) => post({
    url: rootUrl,
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
