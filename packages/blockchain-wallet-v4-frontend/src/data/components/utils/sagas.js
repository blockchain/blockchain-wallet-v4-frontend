import { select } from 'redux-saga/effects'
import { concat, is, isNil, prop } from 'ramda'
import { selectors } from 'data'
import settings from 'config'

export const selectAccounts = function * () {
  const btcHDAccountsInfo = yield select(selectors.core.common.bitcoin.getAccountsInfo)
  const btcAddressesInfo = yield select(selectors.core.common.bitcoin.getAddressesInfo)
  const btcAccountsInfo = concat(btcHDAccountsInfo, btcAddressesInfo)
  const ethAccountsInfoR = yield select(selectors.core.common.ethereum.getAccountsInfo)
  const ethAccountsInfo = ethAccountsInfoR.getOrElse([])
  return {
    btcAccountsInfo,
    ethAccountsInfo
  }
}

export const selectFee = function * (coin) {
  // const bchRatesR = yield select(selectors2.data.bch.getFee)
  const btcRatesR = yield select(selectors.core.data.btc.getFee)
  const ethRatesR = yield select(selectors.core.data.eth.getFee)
  switch (coin) {
    // case 'BCH': return prop('priority', bchRatesR.getOrElse({ regular: 2, priority: 10 }))
    case 'BTC': return btcRatesR.getOrElse({ regular: 10, priority: 25 })
    case 'ETH': return ethRatesR.getOrElse({ regular: 21, priority: 21, gasLimit: 23000 })
  }
}

export const selectRates = function * (coin) {
  // const bchRatesR = yield select(selectors2.data.bch.getRates)
  const btcRatesR = yield select(selectors.core.data.btc.getRates)
  const ethRatesR = yield select(selectors.core.data.eth.getRates)
  switch (coin) {
    // case 'BCH': return bchRatesR.getOrElse({})
    case 'BTC': return btcRatesR.getOrElse({})
    case 'ETH': return ethRatesR.getOrElse({})
  }
}

export const selectShapeshiftPair = function * (pair) {
  const shapeshiftPairR = yield select(selectors.core.data.shapeshift.getPair(pair))
  const shapeshiftPair = shapeshiftPairR.getOrElse({})
  return {
    minimum: prop('minimum', shapeshiftPair),
    maximum: prop('limit', shapeshiftPair)
  }
}

export const selectReceiveAddress = function * (source) {
  const address = prop('address', source)
  const index = prop('index', source)
  if (!isNil(address) && is(String, address)) {
    return address
  }
  if (!isNil(index) && is(Number, index)) {
    const addressR = yield select(selectors.core.common.bitcoin.getNextAvailableReceiveAddress(settings.NETWORK_BITCOIN, index))
    return addressR.getOrElse('')
  }
  throw new Error('Could not generate next BTC receive address')
}

export const selectChangeAddress = function * (source) {
  const address = prop('address', source)
  const index = prop('index', source)
  if (!isNil(address) && is(String, index)) {
    return address
  }
  if (!isNil(index) && is(Number, index)) {
    const addressR = yield select(selectors.core.common.bitcoin.getNextAvailableChangeAddress(settings.NETWORK_BITCOIN, index))
    return addressR.getOrElse('')
  }
  throw new Error('Could not generate next BTC change address')
}
