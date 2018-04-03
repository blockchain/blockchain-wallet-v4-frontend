import { Exchange, utils } from 'blockchain-wallet-v4/src'
import { call, select, takeEvery, takeLatest, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { compose, concat, equals, filter, has, head, is, isNil, map, merge, path, prop } from 'ramda'
import * as selectors2 from '../../selectors'
import { selectors } from 'data'
import { api } from 'services/ApiService'
import settings from 'config'

export const selectAccounts = function* () {
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

export const selectFee = function* (coin) {
  // const bchRatesR = yield select(selectors2.data.bch.getFee)
  const btcRatesR = yield select(selectors2.data.btc.getFee)
  const ethRatesR = yield select(selectors2.data.eth.getFee)
  switch (coin) {
    // case 'BCH': return prop('priority', bchRatesR.getOrElse({ regular: 2, priority: 10 }))
    case 'BTC': return btcRatesR.getOrElse({ regular: 10, priority: 25 })
    case 'ETH': return ethRatesR.getOrElse({ regular: 21, priority: 21, gasLimit: 23000 })
  }
}

export const selectRates = function* (coin) {
  // const bchRatesR = yield select(selectors2.data.bch.getRates)
  const btcRatesR = yield select(selectors2.data.btc.getRates)
  const ethRatesR = yield select(selectors2.data.eth.getRates)
  switch (coin) {
    // case 'BCH': return bchRatesR.getOrElse({})
    case 'BTC': return btcRatesR.getOrElse({})
    case 'ETH': return ethRatesR.getOrElse({})
  }
}

export const selectShapeshiftPair = function* (pair) {
  const shapeshiftPairR = yield select(selectors2.data.shapeshift.getPair(pair))
  const shapeshiftPair = shapeshiftPairR.getOrElse({})
  return {
    minimum: prop('minimum', shapeshiftPair),
    maximum: prop('limit', shapeshiftPair)
  }
}

export const selectReceiveAddress = function* (source) {
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

export const selectChangeAddress = function* (source) {
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


const buildTransaction = function* (values) {
  const source = prop('source', values)
  const sourceAmount = prop('sourceAmount', values)
  const sourceCoin = prop('coin', source)
  const fee = yield call(selectFee, sourceCoin)
  switch (sourceCoin) {
    case 'BTC': {
      const feePerBytePriority = prop('priority', fee)
      const address = prop('address', source) || prop('index', source)
      const wrapper = yield select(selectors.core.wallet.getWrapper)
      const coins = yield call(api.getWalletUnspents, wrapper, address)
      const receiveAddress = yield call(selectReceiveAddress, source)
      const changeAddress = yield call(selectChangeAddress, source)
      return utils.bitcoin.buildTransaction(sourceAmount, coins, prop('priority', fee), receiveAddress, changeAddress)
    }
    case 'ETH': {
      // return utils.ethereum.calculateFee(prop('priority', fee), prop('gasLimit', fee))
    }
  }
}
