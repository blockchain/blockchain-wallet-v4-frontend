import { Exchange, utils } from 'blockchain-wallet-v4/src'
import { call, select, takeEvery, takeLatest, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { compose, concat, equals, filter, has, head, map, merge, path, prop } from 'ramda'
import BigNumber from 'bignumber.js'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as actions from '../../actions'
import * as actionTypes from '../../actionTypes'
import * as selectors2 from '../../selectors'
import { selectors } from 'data'
import { api } from 'services/ApiService'
import { getPairFromCoin, lessThan, lessThanOrEqualTo, greaterThan, greaterThanOrEqualTo } from './services'

const initialized = function * (action) {
  try {
    const { btcAccountsInfo, ethAccountsInfo } = yield call(selectAccounts)
    const initialValues = {
      source: head(btcAccountsInfo),
      target: head(ethAccountsInfo)
    }
    yield put(actions.modules.form.initialize('exchange', initialValues))
    // yield put(actions.data.bch.fetchFee())
    yield put(actions.data.btc.fetchFee())
    yield put(actions.data.eth.fetchFee())
    // yield put(actions.data.bch.fetchRates())
    yield put(actions.data.btc.fetchRates())
    yield put(actions.data.eth.fetchRates())
    yield put(actions.data.shapeshift.fetchShapeshiftPair('bch_btc'))
    yield put(actions.data.shapeshift.fetchShapeshiftPair('bch_eth'))
    yield put(actions.data.shapeshift.fetchShapeshiftPair('btc_bch'))
    yield put(actions.data.shapeshift.fetchShapeshiftPair('btc_eth'))
    yield put(actions.data.shapeshift.fetchShapeshiftPair('eth_bch'))
    yield put(actions.data.shapeshift.fetchShapeshiftPair('eth_btc'))
  } catch (e) {
    // yield put(actions.alerts.displayError('Price index series chart could not be initialized.'))
    console.log(e)
  }
}

const swapClicked = function * () {
  try {
    const form = yield select(selectors2.modules.form.getFormValues('exchange'))
    const source = prop('source', form)
    const target = prop('target', form)
    yield put(actions.modules.form.change('exchange', 'source', target))
    yield put(actions.modules.form.change('exchange', 'target', source))
  } catch (e) {
    console.log(e)
  }
}

const minimumClicked = function * () {
  try {
    const values = yield select(selectors2.modules.form.getFormValues('exchange'))
    const source = prop('source', values)
    const sourceCoin = prop('coin', source)
    const target = prop('target', values)
    const targetCoin = prop('coin', target)
    const pair = getPairFromCoin(sourceCoin, targetCoin)
    const { minimum, maximum } = yield call(selectShapeshiftPair, pair)
    yield put(actions.modules.form.change('exchange', 'sourceAmount', minimum))
  } catch (e) {
    console.log(e)
  }
}

const maximumClicked = function * () {
  try {
    const values = yield select(selectors2.modules.form.getFormValues('exchange'))
    const source = prop('source', values)
    const sourceCoin = prop('coin', source)
    const target = prop('target', values)
    const targetCoin = prop('coin', target)
    const pair = getPairFromCoin(sourceCoin, targetCoin)
    const { minimum, maximum } = yield call(selectShapeshiftPair, pair)
    const effectiveBalance = yield call(calculateEffectiveBalance, values)
    const finalMaximum = lessThan(maximum, effectiveBalance) ? maximum : effectiveBalance
    yield put(actions.modules.form.change('exchange', 'sourceAmount', finalMaximum))
  } catch (e) {
    console.log(e)
  }
}

const change = function * (action) {
  try {
    const form = path(['meta', 'form'], action)
    const field = path(['meta', 'field'], action)
    const value = prop('payload', action)
    if (!equals('exchange', form)) return
    yield call(delay, 500)
    switch (field) {
      case 'source': yield call(changeSource, value); break
      case 'target': yield call(changeTarget, value); break
      case 'sourceAmount': yield call(changeAmount, value, field); break
      case 'sourceFiat': yield call(changeAmount, value, field); break
      case 'targetAmount': yield call(changeAmount, value, field); break
      case 'targetFiat': yield call(changeAmount, value, field); break
    }
  } catch (e) {
    console.log(e)
  }
}

const changeSource = function * (value) {
  const source = value
  const { btcAccountsInfo, ethAccountsInfo } = yield call(selectAccounts)
  const accounts = concat(btcAccountsInfo, ethAccountsInfo)
  const target = compose(head, filter(x => !equals(prop('coin', x), prop('coin', source))))(accounts)
  const formValues = yield select(selectors2.modules.form.getFormValues('exchange'))
  const values = merge(formValues, { source, target })
  const newValues = yield call(convertValues, values)
  yield put(actions.modules.form.initialize('exchange', newValues))
  yield call(validateForm, newValues)
}

const changeTarget = function * (value) {
  const target = value
  const { btcAccountsInfo, ethAccountsInfo } = yield call(selectAccounts)
  const accounts = concat(btcAccountsInfo, ethAccountsInfo)
  const source = compose(head, filter(x => !equals(prop('coin', x), prop('coin', target))))(accounts)
  const formValues = yield select(selectors2.modules.form.getFormValues('exchange'))
  const values = merge(formValues, { source, target })
  const newValues = yield call(convertValues, values)
  yield put(actions.modules.form.initialize('exchange', newValues))
  yield call(validateForm, newValues)
}

const changeAmount = function * (value, type) {
  const formValues = yield select(selectors2.modules.form.getFormValues('exchange'))
  const newValues = yield call(convertValues, formValues, type)
  yield put(actions.modules.form.initialize('exchange', newValues))
  yield call(validateForm, newValues)
}

const validateForm = function * (values) {
  const source = prop('source', values)
  const sourceCoin = prop('coin', source)
  const target = prop('target', values)
  const targetCoin = prop('coin', target)
  const amount = prop('sourceAmount', values)
  const pair = getPairFromCoin(sourceCoin, targetCoin)
  const effectiveBalance = yield call(calculateEffectiveBalance, values)
  const { minimum, maximum } = yield call(selectShapeshiftPair, pair)
  switch (true) {
    case greaterThan(amount, effectiveBalance): return yield put(actions.components.exchange.error('effective_balance', effectiveBalance))
    case lessThan(amount, minimum): return yield put(actions.components.exchange.error('shapeshift_minimum', minimum))
    case greaterThan(amount, maximum): return yield put(actions.components.exchange.error('shapeshift_maximum', maximum))
  }
  return yield put(actions.components.exchange.error(''))
}

const convertValues = function * (values, type) {
  const source = prop('source', values)
  const sourceCoin = prop('coin', source)
  const target = prop('target', values)
  const targetCoin = prop('coin', target)
  const sourceRates = yield call(selectRates, sourceCoin)
  const targetRates = yield call(selectRates, targetCoin)
  const pair = getPairFromCoin(sourceCoin, targetCoin)

  switch (type) {
    case 'sourceAmount': {
      const sourceAmount = prop('sourceAmount', values)
      yield put(actions.components.exchange.statusLoading())
      const quotation = yield call(api.createQuote, sourceAmount, pair, true)
      yield put(actions.components.exchange.statusLoaded())
      const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
      const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
      const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
      return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
    }
    case 'sourceFiat': {
      const sourceFiat = prop('sourceFiat', values)
      const sourceAmount = Exchange.convertFiatToCoin(sourceFiat, 'USD', sourceCoin, sourceCoin, sourceRates).value
      yield put(actions.components.exchange.statusLoading())
      const quotation = yield call(api.createQuote, sourceAmount, pair, true)
      yield put(actions.components.exchange.statusLoaded())
      const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
      const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
      return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
    }
    case 'targetAmount': {
      const targetAmount = prop('targetAmount', values)
      yield put(actions.components.exchange.statusLoading())
      const quotation = yield call(api.createQuote, targetAmount, pair, false)
      yield put(actions.components.exchange.statusLoaded())
      const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
      const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
      const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
      return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
    }
    case 'targetFiat': {
      const targetFiat = prop('targetFiat', values)
      const targetAmount = Exchange.convertFiatToCoin(targetFiat, 'USD', targetCoin, targetCoin, targetRates).value
      yield put(actions.components.exchange.statusLoading())
      const quotation = yield call(api.createQuote, targetAmount, pair, false)
      yield put(actions.components.exchange.statusLoaded())
      const sourceAmount = path(['success', 'depositAmount'], quotation) || 0
      const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
      return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
    }
    default: {
      const sourceAmount = prop('sourceAmount', values)
      yield put(actions.components.exchange.statusLoading())
      const quotation = yield call(api.createQuote, sourceAmount, pair, true)
      yield put(actions.components.exchange.statusLoaded())
      const targetAmount = path(['success', 'withdrawalAmount'], quotation) || 0
      const sourceFiat = Exchange.convertCoinToFiat(sourceAmount, sourceCoin, sourceCoin, 'USD', sourceRates).value
      const targetFiat = Exchange.convertCoinToFiat(targetAmount, targetCoin, targetCoin, 'USD', targetRates).value
      return { source, target, sourceAmount, sourceFiat, targetAmount, targetFiat }
    }
  }
}

const calculateEffectiveBalance = function * (values) {
  const source = prop('source', values)
  const sourceAmount = prop('sourceAmount', values)
  const sourceCoin = prop('coin', source)
  const fee = yield call(selectFee, sourceCoin)

  switch (sourceCoin) {
    // case 'BCH'
    case 'BTC': {
      const feePerBytePriority = prop('priority', fee)
      const address = prop('address', source) || prop('index', source)
      const wrapper = yield select(selectors.core.wallet.getWrapper)
      const data = yield call(api.getWalletUnspents, wrapper, address)
      return utils.bitcoin.calculateEffectiveBalanceBitcoin(data, feePerBytePriority)
    }
    case 'ETH': {
      const gasPrice = prop('priority', fee)
      const gasLimit = prop('gasLimit', fee)
      const address = prop('address', source)
      const addresses = yield select(selectors.core.data.ethereum.getAddresses)
      const balance = addresses.map(path([address, 'balance'])).getOrElse(0)
      return utils.ethereum.calculateEffectiveBalanceEther(gasPrice, gasLimit, balance)
    }
  }
}

const selectAccounts = function* () {
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

const selectFee = function * (coin) {
  // const bchRatesR = yield select(selectors2.data.bch.getFee)
  const btcRatesR = yield select(selectors2.data.btc.getFee)
  const ethRatesR = yield select(selectors2.data.eth.getFee)
  switch (coin) {
    // case 'BCH': return prop('priority', bchRatesR.getOrElse({ regular: 2, priority: 10 }))
    case 'BTC': return btcRatesR.getOrElse({ regular: 10, priority: 25 })
    case 'ETH': return ethRatesR.getOrElse({ regular: 21, priority: 21, gasLimit: 23000 })
  }
}

const selectRates = function * (coin) {
  // const bchRatesR = yield select(selectors2.data.bch.getRates)
  const btcRatesR = yield select(selectors2.data.btc.getRates)
  const ethRatesR = yield select(selectors2.data.eth.getRates)
  switch (coin) {
    // case 'BCH': return bchRatesR.getOrElse({})
    case 'BTC': return btcRatesR.getOrElse({})
    case 'ETH': return ethRatesR.getOrElse({})
  }
}

const selectShapeshiftPair = function * (pair) {
  const shapeshiftPairR = yield select(selectors2.data.shapeshift.getPair(pair))
  const shapeshiftPair = shapeshiftPairR.getOrElse({})
  return {
    minimum: prop('minimum', shapeshiftPair),
    maximum: prop('limit', shapeshiftPair)
  }
}

export default function * () {
  yield takeEvery(AT.EXCHANGE_INITIALIZED, initialized)
  yield takeEvery(AT.EXCHANGE_SWAP_CLICKED, swapClicked)
  yield takeEvery(AT.EXCHANGE_MINIMUM_CLICKED, minimumClicked)
  yield takeEvery(AT.EXCHANGE_MAXIMUM_CLICKED, maximumClicked)
  yield takeLatest(actionTypes.modules.form.CHANGE, change)
}
